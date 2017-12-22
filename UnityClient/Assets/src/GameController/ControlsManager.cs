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

using Assets.src.lib.entities;
using Assets.src.lib.move;



namespace Assets.src.GameController
{
    public partial class GameControllerBehavior : MonoBehaviour
    {
        public GameObject categoryRelocationPrefab;
        public GameObject categoryAttackPrefab;
        public GameObject categoryArrowPrefab;
        public GameObject categoryStonePrefab;
        public GameObject categoryWorkerPrefab;
        public GameObject categoryBarracksPrefab;
        public GameObject categoryChurchPrefab;
        public GameObject categoryFarmPrefab;
        public GameObject categoryMinePrefab;
        public GameObject categoryQuarryPrefab;
        public GameObject categoryWallPrefab;
        public GameObject categoryTowerPrefab;
        public GameObject categoryHousePrefab;
        public GameObject categoryHealPrefab;
        public GameObject categoryCapturePrefab;


        public GameObject categorySwordsmanPrefab;
        public GameObject categorySpearmanPrefab;
        public GameObject categoryHorsemanPrefab;
        public GameObject categoryKnightPrefab;
        public GameObject categoryCatapultPrefab;
        public GameObject categoryPriestPrefab;
        public GameObject categoryMountedPriestPrefab;
        public GameObject categoryArcherPrefab;
        public GameObject categoryChangePrefab;

        public GameObject currentUnitPointer;



        private List<GameObject> oldObjects = new List<GameObject>();

        private List<Move> moves = new List<Move>();

        private ClickableObjectCollection moveClickables;
        private ClickableObjectCollection categoryClickables;

        private ClickableObjectCollectionPack clickablesPack = new ClickableObjectCollectionPack();

        private string category = "Relocation";
        private bool moveSendingActive = false;

        public void InitControls()
        {
            moveClickables = new ClickableObjectCollection(OnClick, clickablesPack);
            categoryClickables = new ClickableObjectCollection(OnCategoryClick, clickablesPack);
        }

        public void PointToUnit(Unit unit)
        {
            Vector3 pos = Geometry.GetGlobalPosition(unit.position, hd);
            CameraPointToUnit(unit);
            this.currentUnitPointer.transform.position = pos;
        }

        public void ResetUnitPointer()
        {
            this.currentUnitPointer.transform.localPosition = tilePlanePrefab.transform.localPosition;
        }


        public List<string> GetAvailableCategories()
        {
            List<string> res = new List<string>();
            for (int i = 0; i < moves.Count; i++)
            {
                if (moves[i].type.Equals("Build"))
                {
                    res.Add(moves[i].recruit.type);
                }
                else
                {
                    if (!moves[i].type.Equals("Idle"))
                    {
                        res.Add(moves[i].type);
                    }
                }
            }


            List<string> result = new List<string>();

            for (int i = 0; i < res.Count; i++)
            {
                if (!result.Contains(res[i]))
                {
                    result.Add(res[i]);
                }
            }

            this.category = result[0];
            return result;
        }

        public void EnableControls()
        {
            for (int i = 0; i < moveClickables.clickables.Count; i++)
            {
                moveClickables.clickables[i].obj.SetActive(true);
            }
        }

        public void DisableControls()
        {
            for (int i = 0; i < moveClickables.clickables.Count; i++)
            {
                moveClickables.clickables[i].obj.SetActive(false);
            }
        }

        public Vector3 GetCategoryPosition(int index)
        {
            float x = Screen.width * 0.95f;
            float y = Screen.height * (0.9f - index * 0.1f);
            float z = (float)(MIN_CAMERA_H * 0.1);
            return new Vector3(x, y, z);
        }

        public void UpdateControls()
        {
            if (Input.GetKeyDown(KeyCode.Space))
            {
                SendIdle();
            }

            this.clickablesPack.Update();

            for (int i = 0; i < categoryClickables.clickables.Count; i++)
            {
                GameObject obj = categoryClickables.clickables[i].obj;
                Vector3 pos = mainCamera.ScreenToWorldPoint(GetCategoryPosition(i));
                obj.transform.position = pos;
            }

            UpdateUnitInfo();
            UpdateTreasury();
        }

        public void OnClick(string s)
        {
            int index = int.Parse(s);
            categoryClickables.Clear();
            SendMove(index);
        }

        public void OnCategoryClick(string s)
        {
            SetCategory(s);
        }
        public void SetMoves(List<Move> moves)
        {
            this.moves = moves;
            moveSendingActive = true;

            List<string> categories = GetAvailableCategories();
            categoryClickables.Clear();

            for (int i = 0; i < categories.Count; i++)
            {
                GameObject prefab = null;
                if (categories[i].Equals("Relocation"))
                {
                    prefab = categoryRelocationPrefab;
                }
                if (categories[i].Equals("Attack"))
                {
                    prefab = categoryAttackPrefab;
                }

                if (categories[i].Equals("Arrow"))
                {
                    prefab = categoryArrowPrefab;
                }

                if (categories[i].Equals("Stone"))
                {
                    prefab = categoryStonePrefab;
                }

                if (categories[i].Equals("Heal"))
                {
                    prefab = categoryHealPrefab;
                }

                if (categories[i].Equals("Capture"))
                {
                    prefab = categoryCapturePrefab;
                }

                if (categories[i].Equals("Change"))
                {
                    prefab = categoryChangePrefab;
                }


                if (prefab == null)
                {
                    prefab = GetCategoryUnitPrefab(categories[i]);
                }

                Clickable clickable = new Clickable(prefab, categories[i], 0.02, 0.025, 0.03);
                Move move = moves[i];
                Vector3 pos = mainCamera.ScreenToWorldPoint(GetCategoryPosition(i));
                categoryClickables.Add(clickable, pos);
            }
            categoryClickables.SetPressed(0);

            SetCategory(category);
        }

        public void SetCategory(string newCategory)
        {
            moveClickables.Clear();
            category = newCategory;

            double normalK = 1.0;
            double hoveredK = 1.3;
            double pressedK = 1.6;

            for (int i = 0; i < moves.Count; i++)
            {
                if (category.Equals("Relocation"))
                {
                    if (moves[i].type.Equals(category))
                    {
                        Clickable clickable = new Clickable(categoryRelocationPrefab, i + "", normalK, hoveredK, pressedK);
                        clickable.id = i + "";
                        clickable.prefab = categoryRelocationPrefab;
                        Move move = moves[i];
                        Vector3 pos = Geometry.GetGlobalPosition(move.end, hd);
                        moveClickables.Add(clickable, pos);
                    }
                }

                if (category.Equals("Attack"))
                {
                    if (moves[i].type.Equals(category))
                    {
                        Clickable clickable = new Clickable(categoryAttackPrefab, i + "", normalK, hoveredK, pressedK);
                        Move move = moves[i];
                        Vector3 posMe = Geometry.GetGlobalPosition(move.end, hd);
                        Vector3 posEnemy = Geometry.GetGlobalPosition(move.enemy.position, hd);
                        Vector3 actualPos = posMe / 2 + posEnemy / 2;
                        actualPos.y += Geometry.CELL_SIZE * 0.2f;

                        double rotation = Geometry.GetAngleGradusi(move.enemy.position.x - move.end.x, move.enemy.position.y - move.end.y);
                        moveClickables.Add(clickable, actualPos);
                        Geometry.SetRotationY(clickable.obj, rotation + 180);
                    }
                }



                if (category.Equals("Heal"))
                {
                    if (moves[i].type.Equals(category))
                    {
                        Clickable clickable = new Clickable(categoryHealPrefab, i + "", normalK, hoveredK, pressedK);
                        Move move = moves[i];
                        Vector3 posMe = Geometry.GetGlobalPosition(move.end, hd);
                        Vector3 posEnemy = Geometry.GetGlobalPosition(move.enemy.position, hd);
                        Vector3 actualPos = posMe / 2 + posEnemy / 2;
                        actualPos.y += Geometry.CELL_SIZE * 0.2f;

                        double rotation = Geometry.GetAngleGradusi(move.enemy.position.x - move.end.x, move.enemy.position.y - move.end.y);
                        moveClickables.Add(clickable, actualPos);
                        Geometry.SetRotationY(clickable.obj, rotation + 180);
                    }
                }


                if (category.Equals("Arrow"))
                {
                    if (moves[i].type.Equals(category))
                    {
                        Clickable clickable = new Clickable(categoryArrowPrefab, i + "", normalK, hoveredK, pressedK);
                        Move move = moves[i];
                        Vector3 posEnemy = Geometry.GetGlobalPosition(move.target, hd);
                        posEnemy.y += Geometry.CELL_SIZE * (float)move.enemy.mainHeight * 1f;
                        moveClickables.Add(clickable, posEnemy);
                    }
                }


                if (category.Equals("Capture"))
                {
                    if (moves[i].type.Equals(category))
                    {
                        Clickable clickable = new Clickable(categoryCapturePrefab, i + "", normalK, hoveredK, pressedK);
                        Move move = moves[i];
                        Vector3 posEnemy = Geometry.GetGlobalPosition(move.enemy.position, hd);
                        posEnemy.y += Geometry.CELL_SIZE * 2f;
                        moveClickables.Add(clickable, posEnemy);
                    }
                }

                if (category.Equals("Stone"))
                {
                    if (moves[i].type.Equals(category))
                    {
                        Clickable clickable = new Clickable(categoryStonePrefab, i + "", normalK, hoveredK, pressedK);
                        Move move = moves[i];
                        Vector3 posEnemy = Geometry.GetGlobalPosition(move.target, hd);
                        posEnemy.y += Geometry.CELL_SIZE * (float)move.enemy.mainHeight * 1.0f;
                        moveClickables.Add(clickable, posEnemy);
                    }
                }

                if (category.Equals("Change"))
                {
                    if (moves[i].type.Equals(category))
                    {
                        Clickable clickable = new Clickable(categoryChangePrefab, i + "", normalK, hoveredK, pressedK);
                        Vector3 pos = Geometry.GetGlobalPosition(moves[i].unit.position, hd);
                        pos.y += Geometry.CELL_SIZE * 2f;
                        moveClickables.Add(clickable, pos);
                    }
                }

                if (moves[i].type.Equals("Build"))
                {
                    if (category.Equals(moves[i].recruit.type))
                    {
                        Clickable clickable = new Clickable(GetCategoryUnitPrefab(category), i + "", normalK, hoveredK, pressedK);
                        Move move = moves[i];
                        Vector3 posMe = Geometry.GetGlobalPosition(move.host.position, hd);
                        Vector3 posRecruit = Geometry.GetGlobalPosition(move.recruit.position, hd);

                        if (category.Equals("Wall"))
                        {
                            Vector3 size = categoryWallPrefab.GetComponent<Renderer>().bounds.size;
                            posRecruit.y += size.y * 0.6f;
                        }

                        if (category.Equals("Tower"))
                        {
                            Vector3 size = categoryTowerPrefab.GetComponent<Renderer>().bounds.size;
                            posRecruit.y += size.y * 0.3f;
                        }

                        Vector3 actualPos = posRecruit;
                        moveClickables.Add(clickable, actualPos);
                    }
                }
            }
        }

        public void SendIdle()
        {
            SendMove(this.moves.Count - 1);
        }

        public void SendMove(int index)
        {
            DeactivateUserInfo();
            ResetUnitPointer();
            if (moveSendingActive)
            {
                MakeMoveResponseToServer response = new MakeMoveResponseToServer();
                response.index = index;
                this.sendOptionsQueue.Enqueue(response);
                DisableControls();
                moveSendingActive = false;
            }
        }



    }



}
