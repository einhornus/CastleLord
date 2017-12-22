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
using System.Threading;
using System;
namespace Assets.src.GameController
{
    public partial class GameControllerBehavior : MonoBehaviour
    {
        private int mapWidth = 0;
        private int mapHeight = 0;
        private double h = 30;
        public double currentX = 0;
        public double currentY = 0;

        public static double CAMERA_SENSE_MOVING = 0.005;
        public static double CAMERA_SENSE_ROTATION = 1;
        public static double CAMERA_FLOW_SPEED = 0.001;

        private double MAX_CAMERA_H = 60;
        private double MIN_CAMERA_H = 8;
        private double MIN_ISOMETRY_ANGLE = 3;
        private double MAX_ISOMETRY_ANGLE = 40;

        public Vector2? cameraFlowTo = null;
        public GameObject light;

        public double GetIsometryAngle(double h)
        {
            double x = (h - MIN_CAMERA_H) / (MAX_CAMERA_H);
            double func = Math.Cos(x * Math.PI / 2.0);
            double angle = MIN_ISOMETRY_ANGLE + (MAX_ISOMETRY_ANGLE - MIN_ISOMETRY_ANGLE) * func;
            return angle;
        }

        public void FocusOn(double x, double y)
        {
            if (hd == null)
            {
                return;
            }

            if (x < 0)
            {
                x = 0;
            }

            if (x > mapWidth - 0)
            {
                x = mapWidth - 0;
            }

            if (y < 0)
            {
                y = 0;
            }

            if (y > mapHeight - 1)
            {
                y = mapHeight - 1;
            }

            this.currentX = x;
            this.currentY = y;

            double isAngle = GetIsometryAngle(this.h);
            Geometry.SetRotationX(mainCamera, 90 - isAngle);
            double alpha = Geometry.GradusiToRadians(90 - Geometry.GetRotationX(mainCamera));
            double beta = Geometry.GradusiToRadians(Geometry.GetRotationY(mainCamera));


            Vector3 gp = Geometry.GetGlobalPosition((float)x, (float)y, hd);
            double d = Math.Tan(alpha) * h;
            double actualX = -Math.Sin(beta) * d + gp.x;
            double actualZ = -Math.Cos(beta) * d + gp.z;


            Geometry.SetPositionY(mainCamera, (float)h);
            Geometry.SetPositionX(mainCamera, (float)actualX);
            Geometry.SetPositionZ(mainCamera, (float)actualZ);


            if (cameraFlowTo.HasValue)
            {
                if (Math.Abs(cameraFlowTo.Value.x - currentX) < 0.001 && Math.Abs(cameraFlowTo.Value.y - currentY) < 0.001)
                {
                    cameraFlowTo = null;
                }
            }

            Geometry.SetRotationX(light, Geometry.GetRotationX(mainCamera));
            Geometry.SetRotationY(light, Geometry.GetRotationY(mainCamera));
            Geometry.SetRotationZ(light, Geometry.GetRotationZ(mainCamera));
        }

        public void SetupCamera(int mapWidth, int mapHeight)
        {
            this.mapWidth = mapWidth;
            this.mapHeight = mapHeight;

            FocusOn(mapWidth / 2, mapHeight / 2);
        }

        public void CameraPointToPoint(Point point)
        {
            Vector3 screenPoint = mainCamera.WorldToScreenPoint(Geometry.GetGlobalPosition(point, null));
            cameraFlowTo = new Vector2(point.x, point.y);
        }

        public void CameraPointToUnit(Unit unit)
        {
            CameraPointToPoint(unit.position);
        }

        public void UpdateCamera()
        {
            //Debug.Log(Input.mousePosition.x +" "+ Input.mousePosition.y+" "+Screen.width+" "+Screen.height);
            if (cameraFlowTo == null)
            {
                if (Input.GetKey(KeyCode.LeftArrow))
                {
                    double rotation = Geometry.GetRotationY(mainCamera);
                    double newRotation = rotation - CAMERA_SENSE_ROTATION;
                    Geometry.SetRotationY(mainCamera, (float)newRotation);
                    FocusOn(currentX, currentY);
                }

                if (Input.GetKey(KeyCode.RightArrow))
                {
                    double rotation = Geometry.GetRotationY(mainCamera);
                    double newRotation = rotation + CAMERA_SENSE_ROTATION;
                    Geometry.SetRotationY(mainCamera, (float)newRotation);
                    FocusOn(currentX, currentY);
                }

                double dx = 0;
                double dy = 0;

                if (Input.GetKey(KeyCode.A))
                {
                    dx -= CAMERA_SENSE_MOVING * h;
                }

                if (Input.GetKey(KeyCode.D))
                {
                    dx += CAMERA_SENSE_MOVING * h;
                }

                if (Input.GetKey(KeyCode.S))
                {
                    dy -= CAMERA_SENSE_MOVING * h;
                }

                if (Input.GetKey(KeyCode.W))
                {
                    dy += CAMERA_SENSE_MOVING * h;
                }

                if (dx != 0 || dy != 0)
                {
                    double beta = -Geometry.GradusiToRadians(Geometry.GetRotationY(mainCamera));
                    double actualDx = dx * Math.Cos(beta) - dy * Math.Sin(beta);
                    double actualDy = dx * Math.Sin(beta) + dy * Math.Cos(beta);
                    FocusOn(currentX + actualDx, currentY + actualDy);
                }
            }
            else
            {
                Vector2 vector = cameraFlowTo.Value - new Vector2((float)this.currentX, (float)this.currentY);
                double speed = CAMERA_FLOW_SPEED * h * GAME_SPEED;

                speed *= (vector.magnitude + 3.0);

                if (vector.magnitude > speed)
                {
                    vector.Normalize();
                    vector = vector * (float)(speed);
                    FocusOn(currentX + vector.x, currentY + vector.y);
                }
                else
                {
                    FocusOn(cameraFlowTo.Value.x, cameraFlowTo.Value.y);
                }
            }
        }

        public void OnWheel(float dWheel)
        {
            if (dWheel == 0)
            {
                return;
            }

            if (dWheel < 0)
            {
                h /= 1.1;
            }
            else
            {
                h *= 1.1;
            }

            if (h > MAX_CAMERA_H)
            {
                h = MAX_CAMERA_H;
            }

            if (h < MIN_CAMERA_H)
            {
                h = MIN_CAMERA_H;
            }

            FocusOn(currentX, currentY);
        }
    }
}
