using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using Quobject.SocketIoClientDotNet.Client;
using Newtonsoft.Json;
using Assets.src.lib.entities;
using Assets.src.lib.action;
using Assets.src.lib.geometry;
using Assets.src.lib;
using System;

namespace Assets.src.GameController
{

    public partial class GameControllerBehavior : MonoBehaviour
    {
        public Vector3 GetSize(GameObject go)
        {
            if (go.GetComponent<Renderer>() == null)
            {
                return new Vector3(1, 1, 1);
            }
            else
            {
                return go.GetComponent<Renderer>().bounds.size;
            }
        }

        public float DistanceFromCameraRayToObject(GameObject obj)
        {
            Ray ray = this.mainCamera.ScreenPointToRay(Input.mousePosition);
            float res = Vector3.Cross(ray.direction, obj.transform.position - ray.origin).magnitude;
            return res;
        }

        public Vector3 AttachGameObjectToUIScreenPoint(GameObject go, float _x, float _y, float _z, bool sz)
        {
            float x = Screen.width*_x;
            float y = Screen.height*_y;
            float z = (float)(MIN_CAMERA_H * _z);
            Vector3 ps = new Vector3(x, y, z);
            Vector3 res = mainCamera.ScreenToWorldPoint(ps);
            go.transform.position = res;

            float angle1 = Quaternion.ToEulerAngles(mainCamera.transform.localRotation).y;
            angle1 *= 180.0f;
            angle1 /= (float)Math.PI;
            Geometry.SetRotationY(go, angle1);


            if (sz) {
                float angle2 = Quaternion.ToEulerAngles(mainCamera.transform.localRotation).x;
                angle2 *= 180.0f;
                angle2 /= (float)Math.PI;
                Geometry.SetRotationX(go, angle2);
            }
            return res;
        }

        public GameObject GetCategoryUnitPrefab(string unit)
        {
            GameObject prefab = null;
            if (unit.Equals("Worker"))
            {
                prefab = categoryWorkerPrefab;
            }

            if (unit.Equals("Barrack"))
            {
                prefab = categoryBarracksPrefab;
            }

            if (unit.Equals("House"))
            {
                prefab = categoryHousePrefab;
            }

            if (unit.Equals("Church"))
            {
                prefab = categoryChurchPrefab;
            }

            if (unit.Equals("Farm"))
            {
                prefab = categoryFarmPrefab;
            }

            if (unit.Equals("Mine"))
            {
                prefab = categoryMinePrefab;
            }

            if (unit.Equals("Quarry"))
            {
                prefab = categoryQuarryPrefab;
            }

            if (unit.Equals("Swordsman"))
            {
                prefab = categorySwordsmanPrefab;
            }

            if (unit.Equals("Spearman"))
            {
                prefab = categorySpearmanPrefab;
            }

            if (unit.Equals("Horseman"))
            {
                prefab = categoryHorsemanPrefab;
            }

            if (unit.Equals("Archer"))
            {
                prefab = categoryArcherPrefab;
            }

            if (unit.Equals("Knight"))
            {
                prefab = categoryKnightPrefab;
            }


            if (unit.Equals("Priest"))
            {
                prefab = categoryPriestPrefab;
            }

            if (unit.Equals("Mounted priest"))
            {
                prefab = categoryMountedPriestPrefab;
            }


            if (unit.Equals("Catapult"))
            {
                prefab = categoryCatapultPrefab;
            }

            if (unit.Equals("Wall"))
            {
                prefab = categoryWallPrefab;
            }

            if (unit.Equals("Tower"))
            {
                prefab = categoryTowerPrefab;
            }

            if (prefab == null)
            {
                Debug.Log("Not parsed: " + unit);
            }

            return prefab;
        }
    }
}
