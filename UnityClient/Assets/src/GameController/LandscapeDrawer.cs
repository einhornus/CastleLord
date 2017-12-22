using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using Quobject.SocketIoClientDotNet.Client;
using Newtonsoft.Json;
using Assets.src.lib.entities;
using Assets.src.lib.action;
using Assets.src.lib.geometry;
using System.Threading;
using System;

namespace Assets.src.GameController
{
    public partial class GameControllerBehavior : MonoBehaviour
    {
        public GameObject[] treePrefabs;
        public GameObject mainTerrain;
        public GameObject[] goldDepositPrefabs;
        public GameObject[] ironDepositPrefabs;
        public GameObject[] stoneDepositPrefabs;
        public GameObject[] waterPrefabs;

        public void DrawLandscape(Map map)
        {

            for (int i = 0; i<map.landscapeTrees.Count; i++)
            {
                
                GameObject prefab = treePrefabs[(random.Next() % treePrefabs.Length)];
                float x = map.landscapeTrees[i].x / 1000f;
                float y = map.landscapeTrees[i].y / 1000f;
                Vector3 position = Geometry.GetGlobalPosition(x, y, hd);
                GameObject spawnedObject = Instantiate(prefab, position, prefab.transform.rotation);
                Geometry.SetRotationY(spawnedObject, random.NextDouble() * 360);
            }

            for (int i = 0; i < map.landscapeIronDeposits.Count; i++)
            {
                GameObject prefab = ironDepositPrefabs[(random.Next() % ironDepositPrefabs.Length)];
                float x = map.landscapeIronDeposits[i].x;
                float y = map.landscapeIronDeposits[i].y;
                Vector3 position = Geometry.GetGlobalPosition(x, y, hd);
                GameObject spawnedObject = Instantiate(prefab, position, prefab.transform.rotation);
                Geometry.SetRotationY(spawnedObject, random.NextDouble() * 360);
            }

            for (int i = 0; i < map.landscapeStoneDeposits.Count; i++)
            {
                GameObject prefab = stoneDepositPrefabs[(random.Next() % stoneDepositPrefabs.Length)];
                float x = map.landscapeStoneDeposits[i].x;
                float y = map.landscapeStoneDeposits[i].y;
                Vector3 position = Geometry.GetGlobalPosition(x, y, hd);
                position.y += (float)(Geometry.CELL_SIZE * 0.2);
                GameObject spawnedObject = Instantiate(prefab, position, prefab.transform.rotation);
                Geometry.SetRotationY(spawnedObject, random.NextDouble() * 360);
            }

            for (int i = 0; i < map.landscapeWater.Count; i++)
            {
                GameObject prefab = waterPrefabs[(random.Next() % waterPrefabs.Length)];
                float x = map.landscapeWater[i].x;
                float y = map.landscapeWater[i].y;
                Vector3 position = Geometry.GetGlobalPosition(x, y, hd);
                position.y += (float)(Geometry.CELL_SIZE * 0.2);
                GameObject spawnedObject = Instantiate(prefab, position, prefab.transform.rotation);
                Geometry.SetRotationY(spawnedObject, random.NextDouble() * 360);
            }
        }
    }
}
