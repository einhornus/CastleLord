using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using Quobject.SocketIoClientDotNet.Client;
using Newtonsoft.Json;


public class SocketIOScript : MonoBehaviour {
	public string serverURL = "http://localhost:4000";

	void Destroy() {
	}

	void Start () {
        Debug.Log("I start");
        var socket = IO.Socket(serverURL);
        socket.On(Socket.EVENT_CONNECT, () =>
        {
            Debug.Log("Connected");
            //socket.Emit("hi");
        });

        socket.On("action", (data) =>
        {
            Debug.Log(data);
        });
    }

}
