using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using Quobject.SocketIoClientDotNet.Client;
using Newtonsoft.Json;
using Assets.src.lib.entities;
using Assets.src.lib.action;
using Assets.src.lib.geometry;
using Assets.src.lib.move;
using System.Threading;
using System;

namespace Assets.src.GameController
{
    public partial class GameControllerBehavior : MonoBehaviour
    {
        public Camera mainCamera;
        public Terrain terrain;
        public Geometry.HeightData hd;

        public double GAME_SPEED = 3.0;

        /*
        public GameObject testPrefab;
        public Material material1;
        public Material material2;

        public ClickableObjectCollection collection = new ClickableObjectCollection(delegate(string s)
        {
            Debug.Log("Clicked " + s);
        });
        */

        void Start()
        {
            /*
            Clickable clickable = new Clickable();
            clickable.id = "me";
            clickable.prefab = testPrefab;
            clickable.initialMaterial = material1;
            clickable.secondMaterial = material2;
            collection.Add(clickable, new Vector3(0, 0, 0));
            */

            InitControls();
            InitSocket();
            ResetUnitPointer();

            /*
            List<PathFragment> list = new List<PathFragment>();
            list.Add(new PathFragment(new lib.Point(0, 1), new lib.Point(0, 2)));
            list.Add(new PathFragment(new lib.Point(0, 2), new lib.Point(0, 3)));
            list.Add(new PathFragment(new lib.Point(0, 3), new lib.Point(0, 4)));
            list.Add(new PathFragment(new lib.Point(0, 4), new lib.Point(1, 4)));
            list.Add(new PathFragment(new lib.Point(1, 4), new lib.Point(1, 5)));
            list.Add(new PathFragment(new lib.Point(1, 5), new lib.Point(1, 6)));
            List<PathFragment> res = SplitPath(list);
            Debug.Log(res);
            */

            /*
            Game game = new Game();
            game.map = new Map();
            game.map.width = 5;
            game.map.height = 6;
            game.units = new List<Unit>();
            InitGame(game);

            List<Move> moves = new List<Move>();
            moves.Add(new RelocationMove(new lib.Point(1, 2)));
            moves.Add(new RelocationMove(new lib.Point(2, 3)));
            moves.Add(new RelocationMove(new lib.Point(1, 4)));
            SetMoves(moves);
            */


            /*
            Unit unit = new Unit();
            unit.type = "Knight";
            unit.isMounted = false;
            unit.position = new lib.Point(0, 1);
            unit.id = "dfffd";
            unit.health = 100;
            PutUnit(unit);


            CombinedAnimation comb = new CombinedAnimation();
            ParallelAnimation parallel = new ParallelAnimation();
            TakeDamageAnimation an1 = new TakeDamageAnimation(this, unit, delegate { });
            DeathAnimation an2 = new DeathAnimation(this, unit, delegate { });
            parallel.AddAnimation(an1);
            parallel.AddAnimation(an2);
            comb.AddAnimation(parallel);
            comb.onDone = delegate(string s)
            {
                Debug.Log("ENDED");
            };
            this.currentAnimations.Add(comb);
            */
        }

        void Update()
        {
            HandleServerActions();
            SendResponsesToServer();
            UpdateCamera();
            OnWheel(Input.GetAxis("Mouse ScrollWheel"));
            ControlUnits();
            UpdateControls();
        }

        void InitGame(Game game)
        {
            hd = new Geometry.HeightData(terrain);

            Geometry.SetupMap(game.map.width, game.map.height);

            DrawLandscape(game.map);


            for (var i = 0; i < game.towers.Count; i++)
            {
                for (var j = 0; j < game.towers[i].Count; j++)
                {
                    Unit tower = game.towers[i][j];
                    if (tower != null)
                    {
                        PutUnit(tower);
                        hd.AddTower(tower.position);
                    }
                }
            }

            for (var i = 0; i < game.units.Count; i++)
            {
                Unit unit = game.units[i];
                if (!unit.type.Equals("Tower")) {
                    PutUnit(unit);
                }
            }


            SetupCamera(game.map.width, game.map.height);
            ResponseToServer response = new ISeeResponseToServer();
            this.sendOptionsQueue.Enqueue(response);
        }
    }
}