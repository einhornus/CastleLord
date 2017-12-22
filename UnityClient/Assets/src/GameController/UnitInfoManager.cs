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
        public GameObject tilePlanePrefab;
        public GameObject userInfoPointer;

        public enum TileMode
        {
            Nothing, 
            Moving,
            Sight
        }

        public GameObject tileModeNothingIcon;
        public GameObject tileModeSightIcon;
        public GameObject tileModeMovingIcon;

        private TileMode currentTileMode;

        private List<GameObject> tilePlanePrefabs = new List<GameObject>();

        public void FindAndSetUnitInfo()
        {
            float bestDistance = float.MaxValue;
            string bestKey = "";

            foreach (var v in models)
            {
                string key = v.Key;
                GameObject value = v.Value;
                float distance = DistanceFromCameraRayToObject(value);
                if (distance < bestDistance && distance < Geometry.CELL_SIZE * 1f)
                {
                    bestDistance = distance;
                    bestKey = key;
                }
            }
            Unit bestUnit = FindUnit(bestKey);

            if (bestUnit != null)
            {
                if (!bestKey.Equals(currentSetUnitInfo))
                {
                    SetUnitInfo(bestUnit);
                }
            }
            else
            {
                ResetUnitInfo();
            }
        }

        public void SetUnitInfo(Unit unit)
        {
            GameObject prefab = GetPutUnitPrefab(unit);
            if (currentUnitInfoObject != null) {
                Destroy(currentUnitInfoObject);
            }
            GameObject newObject = Instantiate(prefab);

            float size = 0.05f;
            newObject.transform.localScale = newObject.transform.localScale * size;

            currentUnitInfoObject = newObject;

            unitIndicatorTitleText.GetComponent<TextMesh>().text = unit.type;
            unitIndicatorHpText.GetComponent<TextMesh>().text = unit.health + " hp";

            bool incomeUnit = unit.type.Equals("Farm") || unit.type.Equals("House") || unit.type.Equals("Mine") || unit.type.Equals("Quarry");
            if (!incomeUnit) {
                unitIndicatorMoraleText.GetComponent<TextMesh>().text = unit.morale + " morale";
            }
            else
            {
                unitIndicatorMoraleText.GetComponent<TextMesh>().text = unit.income + " income";
            }

            unitIndicatorHpText.GetComponent<TextMesh>().color = GetColor(0, 100, unit.health);

            if (!incomeUnit)
            {
                unitIndicatorMoraleText.GetComponent<TextMesh>().color = GetColor(-25, 25, unit.morale);
            }
            else
            {
                unitIndicatorMoraleText.GetComponent<TextMesh>().color = GetColor(0, 150, unit.income);
            }

            if (this.currentTileMode == TileMode.Moving) {
                List<Point> relocationPoints = unit.GetRelocationPoints(obstacles, mapWidth, mapHeight);
                SetTiles(relocationPoints);
            }

            if (this.currentTileMode == TileMode.Sight)
            {
                List<Point> sightPoints = unit.GetSightPoints(obstacles, mapWidth, mapHeight);
                SetTiles(sightPoints);
            }

            Vector3 ps = Geometry.GetGlobalPosition(unit.position, hd);

            ps.y += Geometry.CELL_SIZE * 0;
            userInfoPointer.transform.position = ps;

            currentSetUnitInfo = unit.id;
        }

        public Color GetColor(double lowest, double highest, double actual)
        {
            double val = 0;
            if (actual <= lowest)
            {
                val = 0;
            }

            if (actual >= highest)
            {
                val = 1;
            }

            if (actual > lowest && actual < highest)
            {
                val = (actual - lowest) / (highest - lowest);
            }

            Color res = new Color((float)(1 - val), (float)val, 0.1f);
            return res;
        }

        public void UpdateUnitInfo()
        {

            if (Input.GetKey(KeyCode.X))
            {
                this.currentTileMode = TileMode.Moving;
                ResetUnitInfo();
            }


            if (Input.GetKey(KeyCode.C))
            {
                this.currentTileMode = TileMode.Sight;
                ResetUnitInfo();
            }


            if (Input.GetKey(KeyCode.Z))
            {
                this.currentTileMode = TileMode.Nothing;
                ResetUnitInfo();
            }



            if (this.currentTileMode != TileMode.Nothing) {
                AttachGameObjectToUIScreenPoint(tileModeNothingIcon, 0.8f, 0.1f, 0.1f, false);
            }
            else
            {
                AttachGameObjectToUIScreenPoint(tileModeNothingIcon, 0.8f, 0.1f, 0.08f, false);
            }

            if (this.currentTileMode != TileMode.Sight)
            {
                AttachGameObjectToUIScreenPoint(tileModeSightIcon, 0.9f, 0.1f, 0.1f, false);
            }
            else
            {
                AttachGameObjectToUIScreenPoint(tileModeSightIcon, 0.9f, 0.1f, 0.08f, false);
            }

            if (this.currentTileMode != TileMode.Moving) {
                AttachGameObjectToUIScreenPoint(tileModeMovingIcon, 0.85f, 0.1f, 0.1f, false);
            }
            else
            {
                AttachGameObjectToUIScreenPoint(tileModeMovingIcon, 0.85f, 0.1f, 0.08f, false);
            }


            if (userInfoActive) {
                FindAndSetUnitInfo();

                if (currentUnitInfoObject != null) {
                    AttachGameObjectToUIScreenPoint(currentUnitInfoObject, 0.1f, 0.12f, 0.1f, false);
                }

                if (unitIndicatorTitleText != null) {
                    AttachGameObjectToUIScreenPoint(unitIndicatorTitleText, 0.05f, 0.3f, 0.5f, true);
                }

                if (unitIndicatorTitleText != null)
                {
                    AttachGameObjectToUIScreenPoint(unitIndicatorHpText, 0.05f, 0.26f, 0.5f, true);
                }

                if (unitIndicatorTitleText != null)
                {
                    AttachGameObjectToUIScreenPoint(unitIndicatorMoraleText, 0.05f, 0.235f, 0.5f, true);
                }
            }
        }

        public void DeactivateUserInfo()
        {
            this.userInfoActive = false;
            ResetUnitInfo();
        }

        public void ResetUnitInfo()
        {
            currentSetUnitInfo = "";
            unitIndicatorTitleText.GetComponent<TextMesh>().text = "";
            unitIndicatorHpText.GetComponent<TextMesh>().text = "";
            unitIndicatorMoraleText.GetComponent<TextMesh>().text = "";
            Destroy(currentUnitInfoObject);
            userInfoPointer.transform.position = tilePlanePrefab.transform.position;
            ResetTiles();
        }

        public GameObject unitIndicatorTitleText;
        public GameObject unitIndicatorHpText;
        public GameObject unitIndicatorMoraleText;
        private GameObject currentUnitInfoObject;

        public Unit FindUnit(string id)
        {
            for (int i = 0; i < unitInfo.Count; i++)
            {
                if (unitInfo[i].id.Equals(id))
                {
                    return unitInfo[i];
                }
            }
            return null;
        }

        private List<Unit> unitInfo = new List<Unit>();
        private List<Obstacle> obstacles = new List<Obstacle>();

        private bool userInfoActive = false;

        public void SetTiles(List<Point> list)
        {
            if (list.Count > tilePlanePrefabs.Count)
            {
                for (int i = tilePlanePrefabs.Count; i<list.Count; i++)
                {
                    GameObject newTP = Instantiate(tilePlanePrefab);
                    tilePlanePrefabs.Add(newTP);
                }
            }

            for (int i = 0; i < list.Count; i++)
            {
                Vector3 position = Geometry.GetGlobalPositionNoTowers(list[i], hd);
                position.y += Geometry.CELL_SIZE * 0.1f;
                tilePlanePrefabs[i].transform.position = position;
            }

            for (int i = list.Count; i < tilePlanePrefabs.Count; i++)
            {
                tilePlanePrefabs[i].transform.position = tilePlanePrefab.transform.position;
            }
        }

        public void ResetTiles()
        {
            SetTiles(new List<Point>());
        }

        private string currentSetUnitInfo = "";

        public void SetUnitsInfo(List<Unit> units, List<Obstacle> obstacles)
        {
            userInfoActive = true;
            currentSetUnitInfo = "";
            this.unitInfo = units;
            this.obstacles = obstacles;
            ResetUnitInfo();
        }
    }
}
