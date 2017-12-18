using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;
using UnityEngine;
using System.Collections;


namespace Assets.src.lib.geometry
{
    public class Geometry
    {
        public static float CELL_SIZE = 2f;
        public static float TOWER_HEIGHT = CELL_SIZE * 2.3f;
        public static float TOWER_RADIUS = CELL_SIZE * 0.7f;

        public static int mapWidth = 0;
        public static int mapHeight = 0;

        public class HeightData{
            private Terrain terrain;
            List<Point> towers = new List<Point>();

            public float GetHeight(float x, float y)
            { 
                float res = GetHeightNoTower(x, y);
                float towerBuff = 0;
                float actualX = x * CELL_SIZE;
                float actualZ = y * CELL_SIZE;
                Vector3 pos = new Vector3(actualX, 0, actualZ);
                for (int i = 0; i<towers.Count; i++)
                {
                    Vector3 towerVector = new Vector3(towers[i].x*CELL_SIZE, 0, towers[i].y * CELL_SIZE);
                    var dist = Vector3.Distance(pos, towerVector);
                    if (dist <= TOWER_RADIUS)
                    {
                        towerBuff = TOWER_HEIGHT;
                    }
                }

                res += towerBuff;
                return res;
            }

            public float GetHeightNoTower(float x, float y)
            {
                float actualX = x * CELL_SIZE;
                float actualZ = y * CELL_SIZE;
                Vector3 pos = new Vector3(actualX, 0, actualZ);
                float res = Terrain.activeTerrain.SampleHeight(pos);
                return res;
            }


            public void AddTower(Point point)
            {
                this.towers.Add(point);
            }

            public void RemoveTower(Point point)
            {
                for (int i = 0; i<towers.Count; i++)
                {
                    if (towers[i].x == point.x && towers[i].y == point.y)
                    {
                        towers.RemoveAt(i);
                        return;
                    }
                }
            }

            public HeightData(Terrain terrain)
            {
                this.terrain = terrain;
            }
        }


        public static double GradusiToRadians(double gradusi)
        {
            return gradusi / 180.0 * Math.PI;
        }

        public static double RaduansToGradusi(double radians)
        {
            return radians * 180.0 / Math.PI;
        }

        public static void SetupMap(int mapWidth, int mapHeight)
        {
            Geometry.mapWidth = mapWidth;
            Geometry.mapHeight = mapHeight;
        }

        public static Vector3 GetGlobalPosition(Point point, HeightData hd)
        {
            return GetGlobalPosition(point.x, point.y, hd);
        }


        public static Vector3 GetGlobalPositionNoTowers(Point point, HeightData hd)
        {
            return GetGlobalPositionNoTowers(point.x, point.y, hd);
        }

        public static Vector3 GetGlobalPosition(float x, float y, HeightData hd)
        {
            float h = 0;
            if (hd != null)
            {
                h = hd.GetHeight(x, y);
            }
            float _x = x * CELL_SIZE;
            float _y = h + CELL_SIZE * 0.05f;
            float _z = y * CELL_SIZE;
            Vector3 res = new Vector3(_x, _y, _z);
            return res;
        }

        public static Vector3 GetGlobalPositionNoTowers(float x, float y, HeightData hd)
        {
            float _x = x * CELL_SIZE;
            float _y = hd.GetHeightNoTower(x, y) + CELL_SIZE * 0.05f;
            float _z = y * CELL_SIZE;
            Vector3 res = new Vector3(_x, _y, _z);
            return res;
        }

        public static float GetRotationX(Component obj)
        {
            return obj.GetComponent<Transform>().localRotation.eulerAngles.x;
        }

        public static float GetRotationY(Component obj)
        {
            return obj.GetComponent<Transform>().localRotation.eulerAngles.y;
        }

        public static float GetRotationZ(Component obj)
        {
            return obj.GetComponent<Transform>().localRotation.eulerAngles.z;
        }


        public static void SetRotationX(Component obj, double angle)
        {
            Quaternion quat = obj.GetComponent<Transform>().localRotation;
            obj.GetComponent<Transform>().localRotation = Quaternion.Euler((float)angle, quat.eulerAngles.y, quat.eulerAngles.z);
        }

        public static void SetRotationY(Component obj, double angle)
        {
            Quaternion quat = obj.GetComponent<Transform>().localRotation;
            obj.GetComponent<Transform>().localRotation = Quaternion.Euler(quat.eulerAngles.x, (float)angle, quat.eulerAngles.z);
        }

        public static void SetRotationZ(Component obj, double angle)
        {
            Quaternion quat = obj.GetComponent<Transform>().localRotation;
            obj.GetComponent<Transform>().localRotation = Quaternion.Euler(quat.eulerAngles.x, quat.eulerAngles.y, (float)angle);
        }

        public static float GetRotationX(GameObject obj)
        {
            return obj.GetComponent<Transform>().localRotation.eulerAngles.x;
        }

        public static float GetRotationY(GameObject obj)
        {
            return obj.GetComponent<Transform>().localRotation.eulerAngles.y;
        }

        public static float GetRotationZ(GameObject obj)
        {
            return obj.GetComponent<Transform>().localRotation.eulerAngles.z;
        }


        public static void SetRotationX(GameObject obj, double angle)
        {
            Quaternion quat = obj.GetComponent<Transform>().localRotation;
            obj.GetComponent<Transform>().localRotation = Quaternion.Euler((float)angle, quat.eulerAngles.y, quat.eulerAngles.z);
        }

        public static void SetRotationY(GameObject obj, double angle)
        {
            Quaternion quat = obj.GetComponent<Transform>().localRotation;
            obj.GetComponent<Transform>().localRotation = Quaternion.Euler(quat.eulerAngles.x, (float)angle, quat.eulerAngles.z);
        }

        public static void SetRotationZ(GameObject obj, double angle)
        {
            Quaternion quat = obj.GetComponent<Transform>().localRotation;
            obj.GetComponent<Transform>().localRotation = Quaternion.Euler(quat.eulerAngles.x, quat.eulerAngles.y, (float)angle);
        }

        public static double GetAngleGradusi(double dx, double dy)
        {
            double a = Math.Atan2(dx, dy);
            double res = Geometry.RaduansToGradusi(a);
            return res;
        }

        public static float GetPositionX(Component obj)
        {
            return obj.GetComponent<Transform>().localPosition.x;
        }

        public static float GetPositionY(Component obj)
        {
            return obj.GetComponent<Transform>().localPosition.y;
        }

        public static float GetPositionZ(Component obj)
        {
            return obj.GetComponent<Transform>().localPosition.z;
        }

        public static void SetPositionX(Component obj, float x)
        {
            Transform transform = obj.GetComponent<Transform>();
            obj.GetComponent<Transform>().localPosition = new Vector3(x, transform.localPosition.y, transform.localPosition.z);
        }

        public static void SetPositionY(Component obj, float y)
        {
            Transform transform = obj.GetComponent<Transform>();
            obj.GetComponent<Transform>().localPosition = new Vector3(transform.localPosition.x, y, transform.localPosition.z);
        }

        public static void SetPositionZ(Component obj, float z)
        {
            Transform transform = obj.GetComponent<Transform>();
            obj.GetComponent<Transform>().localPosition = new Vector3(transform.localPosition.x, transform.localPosition.y, z);
        }


        public static void SetPositionX(GameObject obj, float x)
        {
            Transform transform = obj.GetComponent<Transform>();
            obj.GetComponent<Transform>().localPosition = new Vector3(x, transform.localPosition.y, transform.localPosition.z);
        }

        public static void SetPositionY(GameObject obj, float y)
        {
            Transform transform = obj.GetComponent<Transform>();
            obj.GetComponent<Transform>().localPosition = new Vector3(transform.localPosition.x, y, transform.localPosition.z);
        }

        public static void SetPositionZ(GameObject obj, float z)
        {
            Transform transform = obj.GetComponent<Transform>();
            obj.GetComponent<Transform>().localPosition = new Vector3(transform.localPosition.x, transform.localPosition.y, z);
        }
    }
}
