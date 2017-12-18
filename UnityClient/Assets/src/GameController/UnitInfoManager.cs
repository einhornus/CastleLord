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

        private List<GameObject> tilePlanePrefabs = new List<GameObject>();

        public void FindAndSetUnitInfo()
        {
            float bestDistance = float.MaxValue;
            string bestKey = "";

            foreach (var v in models)
            {
                string key = v.Key;
                GameObject value = v.Value;

                Vector3 screenPointObject = Camera.main.WorldToScreenPoint(value.transform.localPosition);
                float distance = Vector3.Distance(screenPointObject, Input.mousePosition);
                if (bestDistance > distance && distance < GetSize(value).x * 40)
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
            Debug.Log("Setting "+unit.type);

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
            unitIndicatorMoraleText.GetComponent<TextMesh>().text = unit.morale + " morale";

            unitIndicatorHpText.GetComponent<TextMesh>().color = GetColor(0, 100, unit.health);
            unitIndicatorMoraleText.GetComponent<TextMesh>().color = GetColor(-25, 25, unit.morale);

            List<Point> relocationPoints = unit.GetRelocationPoints(obstacles, width, height);
            SetTiles(relocationPoints);

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

        public void ResetUnitInfo()
        {
            currentSetUnitInfo = "";
            unitIndicatorTitleText.GetComponent<TextMesh>().text = "";
            unitIndicatorHpText.GetComponent<TextMesh>().text = "";
            unitIndicatorMoraleText.GetComponent<TextMesh>().text = "";
            Destroy(currentUnitInfoObject);
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
        private int width;
        private int height;

        public void SetTiles(List<Point> list)
        {
            for (int i = 0; i<tilePlanePrefabs.Count; i++)
            {
                Destroy(tilePlanePrefabs[i]);
            }

            tilePlanePrefabs = new List<GameObject>();
            for (int i = 0; i<list.Count; i++)
            {
                GameObject newTP = Instantiate(tilePlanePrefab);
                newTP.transform.position = Geometry.GetGlobalPositionNoTowers(list[i], hd);
                tilePlanePrefabs.Add(newTP);
            }
        }

        private string currentSetUnitInfo = "";

        public void SetUnitsInfo(List<Unit> units, List<Obstacle> obstacles, int width, int height)
        {
            currentSetUnitInfo = "";
            this.unitInfo = units;
            this.obstacles = obstacles;
            this.width = width;
            this.height = height;
            ResetUnitInfo();
        }
    }
}
