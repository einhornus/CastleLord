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

        private List<Point> _relocationPoints;

        private List<Point> calculateRelocationPoints(List<Obstacle> obstacles, int width, int height)
        {
            bool[,] obstacleMap = new bool[width, height];
            for (int i = 0; i<obstacles.Count; i++) {
                obstacleMap[obstacles[i].x, obstacles[i].y] = true;
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
            q.Enqueue(new int[]{(int)position.x, (int)position.y});

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

        public List<Point> GetRelocationPoints(List<Obstacle> obstacles, int width, int height)
        {
            if (_relocationPoints == null)
            {
                relocationPoints = calculateRelocationPoints(obstacles, width, height);
                _relocationPoints = relocationPoints;
            }
            return _relocationPoints;
        }

        public List<Point> sightPoints { get; set; }
        public List<Point> relocationPoints { get; set; }


        public int directionX = 1;
        public int directionY = 1;
        public int size = -1;
    }
}
