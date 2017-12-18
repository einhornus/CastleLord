using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using Quobject.SocketIoClientDotNet.Client;
using Newtonsoft.Json;
using Assets.src.lib.entities;
using Assets.src.lib.action;
using Assets.src.lib.move;

using System.Threading;


namespace Assets.src.GameController
{

    public abstract class ResponseToServer{
        public string type { get; set; }
    }

    public class ISeeResponseToServer : ResponseToServer
    {
        public ISeeResponseToServer()
        {
            this.type = "Response";
        }

        public override string ToString()
        {
            string s = "{type: '" + type + "'}";
            s = s.Replace('\'', '\"');
            return s;
        }
    }

    public class MakeMoveResponseToServer : ResponseToServer
    {
        public int index { get; set; }


        public MakeMoveResponseToServer()
        {
            this.type = "Move";
        }

        public override string ToString()
        {
            string s = "{type: '" + type + "', index: " + index + "}";
            s = s.Replace('\'', '\"');
            return s;
        }
    }

    public partial class GameControllerBehavior : MonoBehaviour
    {
        private string serverURL = "http://localhost:4000";
        private Socket socket;
        private Queue<Action> receivedActionsQueue = new Queue<Action>();
        private Queue<ResponseToServer> sendOptionsQueue = new Queue<ResponseToServer>();
        private System.Random random = new System.Random();


        public void InitSocket()
        {
            this.socket = IO.Socket(serverURL);

            socket.On(Socket.EVENT_CONNECT, () =>
            {
                Debug.Log("Connected");
            });


            socket.On("action", (data) =>
            {
                try
                {
                    string s = data.ToString();
                    Debug.Log("Received "+s);
                    Action action = Action.Parse(s);
                    //Debug.Log(action.GetType() + " " + action.type);
                    this.receivedActionsQueue.Enqueue(action);
                }
                catch (System.Exception ex)
                {
                    Debug.Log(ex);
                }
            });


            socket.On("error", (error) =>
            {
                Debug.Log(error.ToString());
            });
        }

        public void SendResponsesToServer()
        {
            while (this.sendOptionsQueue.Count > 0)
            {
                ResponseToServer response = this.sendOptionsQueue.Dequeue();
                string s = JsonConvert.SerializeObject(response);
                Debug.Log("Sent "+s);

                if (socket != null) {
                    socket.Emit("answer", s);
                }
            }
        }

        public void HandleServerActions()
        {
            while (this.receivedActionsQueue.Count > 0)
            {
                Action action = this.receivedActionsQueue.Dequeue();

                if (action is InitGameAction)
                {
                    InitGame(((InitGameAction)(action)).game);
                }
                if (action is YourMoveAction)
                {
                    YourMoveAction yma = (YourMoveAction)action;

                    SetUnitsInfo(yma.units, yma.obstacles, yma.width, yma.height);
                    SetTreasury(yma);

                    Debug.Log(yma.moves.Count);
                    if (yma.moves.Count > 1)
                    {
                        this.SetMoves(yma.moves);
                        PointToUnit(yma.unit);
                    }
                    else
                    {
                        this.moveSendingActive = true;
                        Debug.Log("Send idle");
                        SendMove(0);
                    }
                }
                if (action is MoveUnitAction)
                {
                    this.MoveUnit((MoveUnitAction)action);
                }

                if (action is AttackUnitAction)
                {
                    this.AttackUnit((AttackUnitAction)action);
                }

                if (action is AppearUnitAction)
                {
                    this.AppearUnit(((AppearUnitAction)action).unit);
                }

                if (action is HealUnitAction)
                {
                    this.HealUnit((HealUnitAction)action);
                }

                if (action is CaptureUnitAction)
                {
                    this.CaptureBuilding((CaptureUnitAction)action);
                }

                if (action is ChangeStateAction)
                {
                    this.ChangeUnitState((ChangeStateAction)action);
                }
            }
        }

        void OnApplicationQuit()
        {
            Debug.Log("I closed");
            socket.Close();
        }
    }
}
