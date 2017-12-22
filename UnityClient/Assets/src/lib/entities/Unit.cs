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

namespace Assets.src.lib.entities
{
    public class Unit
    {
        public Point position { get; set; }
        public int color { get; set; }
        public string id { get; set; }
        public int health { get; set; }
        public int morale { get; set; }
        public string type { get; set; }
        public bool isMounted { get; set; }
        public int speed { get; set; }
        public double currentHeight { get; set; }
        public int sightRadius { get; set; }
        public double mainHeight { get; set; }
        public int income { get; set; }



        public static int WEAPON_HAMMER = 0;
        public static int WEAPON_SPEAR = 1;
        public static int WEAPON_SWORD = 2;
        public static int WEAPON_BOW = 3;
        public static int WEAPON_STONES = 4;


        public static int DEFENCE_NOTHING = 0;
        public static int DEFENCE_SHIELD = 1;
        public static int DEFENCE_HORSE = 2;
        public static int DEFENCE_PLATE = 3;
        public static int DEFENCE_WOOD_BUILDING = 4;
        public static int DEFENCE_STONE_BUILDING = 5;
        public static int DEFENCE_CATAPULT = 6;
        public static int DEFENCE_BEAR = 7;


        private List<Point> _relocationPoints;
        private List<Point> _sightPoints;


        private List<Point> calculateRelocationPoints(List<Obstacle> obstacles, int width, int height)
        {
            bool[,] obstacleMap = new bool[width, height];
            for (int i = 0; i<obstacles.Count; i++) {
                Obstacle obstacle = obstacles[i];

                if (this.color == 0 && obstacle.whiteGate)
                {
                    continue;
                }

                if (this.color == 1 && obstacle.blackGate)
                {
                    continue;
                }

                if (obstacles[i].x >= 0 && obstacles[i].x < width)
                {
                    if (obstacles[i].y >= 0 && obstacles[i].y < height)
                    {
                        obstacleMap[obstacles[i].x, obstacles[i].y] = true;
                    }
                }
            }

            int[,] paths = new int[width, height];
            for (int i = 0; i<width; i++)
            {
                for (int j = 0; j<height; j++)
                {
                    paths[i, j] = -1;
                }
            }

            //Debug.Log((int)position.x + " " + (int)position.y + " " + width + " " + height);
            paths[(int)position.x, (int)position.y] = 0;

            int[][] directions = new int[][]
            {
                new int[]{-1, -1},
                new int[]{ 0, -1},
                new int[]{ 1, -1},
                new int[]{-1,  0},
                new int[]{ 1,  0},
                new int[]{-1,  1},
                new int[]{ 0,  1},
                new int[]{ 1,  1},
            };

            Queue<int[]> q = new Queue<int[]>();

            if (this.speed > 0) {
                q.Enqueue(new int[] { (int)position.x, (int)position.y });
            }

            while (q.Count > 0)
            {
                int[] poped = q.Dequeue();
                int oldLen = paths[poped[0], poped[1]];

                for (int i = 0; i<directions.Length; i++)
                {
                    int newX = poped[0] + directions[i][0];
                    int newY = poped[1] + directions[i][1];

                    if (newX >= 0 && newX < width)
                    {
                        if (newY >= 0 && newY < height)
                        {
                            if (!obstacleMap[newX, newY])
                            {
                                if (paths[newX, newY] == -1)
                                {
                                    int[] ar = new int[] { newX, newY };
                                    int newLen = oldLen + 1;
                                    paths[newX, newY] = newLen;

                                    if (newLen < speed) {
                                        q.Enqueue(ar);
                                    }
                                }
                            }
                        }
                    }
                }
            }

            List<Point> res = new List<Point>();
            for (int i = 0; i<width; i++)
            {
                for (int j = 0; j<height; j++)
                {
                    if (paths[i, j] != -1)
                    {
                        res.Add(new Point(i, j));
                    }
                }
            }
            return res;
        }





        private List<Point> CalculateSightPoints(List<Obstacle> obstacles, int width, int height)
        {
            List<Point> res = new List<Point>();
            double targetHeight = 0;

            List<Obstacle> actualObstacles = new List<Obstacle>();

            for (int i = 0; i<obstacles.Count; i++)
            {
                Obstacle obstacle = obstacles[i];
                if (Point.Dist(obstacle.x, obstacle.y, this.position.x, this.position.y) <= sightRadius)
                {
                    actualObstacles.Add(obstacle);
                }
            }

            for (int i = (int)this.position.x - sightRadius; i<=(int)this.position.x + sightRadius; i++)
            {
                for (int j = (int)this.position.y - sightRadius; j <= (int)this.position.y + sightRadius; j++)
                {
                    if (i < 0 || i>=width)
                    {
                        continue;
                    }

                    if (j < 0 || j >= height)
                    {
                        continue;
                    }

                    int sqDist = (i - (int)this.position.x) * (i - (int)this.position.x) + (j - (int)this.position.y) * (j - (int)this.position.y);
                    if (sqDist <= sightRadius * sightRadius)
                    {
                        var good = true;
                        for (int k = 0; k < actualObstacles.Count; k++)
                        {
                            var obs = actualObstacles[k];
                            int fromX = (int)position.x;
                            int fromY = (int)position.y;
                            if (!CanShootThroughtObstacle(fromX, fromY, i, j, obs, currentHeight, targetHeight))
                            {
                                good = false;
                                break;
                            }
                        }
                        if (good)
                        {
                            res.Add(new Point(i, j));
                        }
                    }
                }
            }
            return res;
        }

        private bool CanShootThroughtObstacle(int fromX, int fromY, int toX, int toY, Obstacle obstacle, double myHeihgt, double targetHeight)
        {
            if (obstacle.x == fromX && obstacle.y == fromY)
            {
                return true;
            }

            if (obstacle.x == toX && obstacle.y == toY)
            {
                return true;
            }

            double dbetween = Math.Sqrt(Math.Pow((toX - fromX), 2) + Math.Pow((toY - fromY), 2));
            double dist = Math.Abs((toY - fromY) * obstacle.x - (toX - fromX) * obstacle.y + toX * fromY - toY * fromX);
            dist /= dbetween;

            var d1 = Point.Dist(fromX, fromY, obstacle.x, obstacle.y);
            var d2 = Point.Dist(toX, toY, obstacle.x, obstacle.y);


            if (dist >= 0.5)
            {
                return true;
            }
            else
            {
                if (d1 > dbetween)
                {
                    return true;
                }

                if (d2 > dbetween)
                {
                    return true;
                }

                var pos = d1 / dbetween;
                var heightOnObstacle = (1 - pos) * myHeihgt + (pos) * targetHeight;
                if (heightOnObstacle >= obstacle.height)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }




        public List<Point> GetRelocationPoints(List<Obstacle> obstacles, int width, int height)
        {
            if (_relocationPoints == null)
            {
                _relocationPoints = calculateRelocationPoints(obstacles, width, height); ;
            }
            return _relocationPoints;
        }


        public List<Point> GetSightPoints(List<Obstacle> obstacles, int width, int height)
        {
            if (_sightPoints == null)
            {
                _sightPoints = CalculateSightPoints(obstacles, width, height);
            }
            return _sightPoints;
        }


        public int directionX = 1;
        public int directionY = 1;
        public int size = -1;
    }
}
