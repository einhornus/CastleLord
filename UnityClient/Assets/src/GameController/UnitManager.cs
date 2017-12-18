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
        public Dictionary<string, Unit> unitMap = new Dictionary<string, Unit>();
        public Dictionary<string, GameObject> models = new Dictionary<string, GameObject>();

        public GameObject mountedLordPrefabRed;
        public GameObject unmountedLordPrefabRed;
        public GameObject mountedLordPrefabBlue;
        public GameObject unmountedLordPrefabBlue;
        public GameObject workerPrefabRed;
        public GameObject workerPrefabBlue;
        public GameObject archerPrefabRed;
        public GameObject archerPrefabBlue;
        public GameObject barrackPrefabRed;
        public GameObject barrackPrefabBlue;
        public GameObject churchPrefabRed;
        public GameObject churchPrefabBlue;
        public GameObject farmPrefabRed;
        public GameObject farmPrefabBlue;
        public GameObject minePrefabRed;
        public GameObject minePrefabBlue;
        public GameObject quarryPrefabRed;
        public GameObject quarryPrefabBlue;
        public GameObject swordsmanPrefabRed;
        public GameObject swordsmanPrefabBlue;
        public GameObject mountedKnightPrefabRed;
        public GameObject unmountedKnightPrefabRed;
        public GameObject mountedKnightPrefabBlue;
        public GameObject unmountedKnightPrefabBlue;
        public GameObject spearmanPrefabRed;
        public GameObject spearmanPrefabBlue;
        public GameObject horsemanPrefabRed;
        public GameObject horsemanPrefabBlue;
        public GameObject priestPrefabRed;
        public GameObject priestPrefabBlue;
        public GameObject mountedPriestPrefabRed;
        public GameObject mountedPriestPrefabBlue;
        public GameObject catapultPrefabRed;
        public GameObject catapultPrefabBlue;
        public GameObject housePrefabRed;
        public GameObject housePrefabBlue;
        public GameObject bearPrefab;


        public GameObject wallFragmentPrefab;
        public GameObject gatePrefab;
        public GameObject towerPrefab;

        public GameObject damageText;

        public List<Animation> currentAnimations = new List<Animation>();

        void PutUnit(Unit unit)
        {
            unitMap.Add(unit.id, unit);

            Vector3 position = Geometry.GetGlobalPosition(unit.position, hd);
            Debug.Log(unit.type +" " + position);


            GameObject prefab = GetPutUnitPrefab(unit);


            if (unit.type.Equals("Wall"))
            {
                Vector3 size = wallFragmentPrefab.GetComponent<Renderer>().bounds.size;
                position.y += size.y * 0.7f;
            }

            if (unit.type.Equals("House"))
            {
                Vector3 size = categoryHousePrefab.GetComponent<Renderer>().bounds.size;
                position.y += size.y * 1.0f;
            }

            if (unit.type.Equals("Tower"))
            {
                Vector3 size = wallFragmentPrefab.GetComponent<Renderer>().bounds.size;
                position.y += size.y * 0.6f;

                hd.AddTower(unit.position);
            }

            if (unit.type.Equals("Gate"))
            {
                Vector3 size = wallFragmentPrefab.GetComponent<Renderer>().bounds.size;
                position.y += size.y * 0.3f;
            }


            Vector3 oldScale = prefab.transform.localScale;

            GameObject spawnedObject = Instantiate(prefab, position, prefab.transform.rotation);
            models.Add(unit.id, spawnedObject);

            if (unit.size != -1)
            {
                Vector3 newScale = oldScale * unit.size;
                spawnedObject.transform.localScale = newScale;
            }
        }

        public void MoveUnit(MoveUnitAction action)
        {
            CameraPointToPoint(action.from);
            CombinedAnimation comb = new CombinedAnimation();
            double currentAngle = Geometry.GetRotationY(models[action.unit.id]);


            List<PathFragment> newPath = SplitPath(action.path);
            for (int i = 0; i < newPath.Count; i++)
            {

                Point from = newPath[i].from;
                Point to = newPath[i].to;

                MoveAnimation ma = new MoveAnimation(this, action.unit, delegate{ }, from, to);

                double grad = Geometry.GetAngleGradusi(to.x - from.x, to.y - from.y);
                if (grad != currentAngle)
                {
                    RotateAnimation ra = new RotateAnimation(this, action.unit, delegate { }, grad);
                    comb.AddAnimation(ra);
                }
                currentAngle = grad;
                comb.AddAnimation(ma);
            }

            comb.onDone = delegate
            {
                ResponseToServer response = new ISeeResponseToServer();
                this.sendOptionsQueue.Enqueue(response);
            };
            //comb.speed = action.path.Count * Animation.DEFAULT_SPEED;

            this.currentAnimations.Add(comb);
        }

        public GameObject GetPutUnitPrefab(Unit unit)
        {
            GameObject prefab = null;
            if (unit.type.Equals("Lord") && unit.color == 0)
            {
                if (unit.isMounted)
                {
                    prefab = mountedLordPrefabBlue;
                }
                else
                {
                    prefab = unmountedLordPrefabBlue;
                }
            }

            if (unit.type.Equals("Lord") && unit.color == 1)
            {
                if (unit.isMounted)
                {
                    prefab = mountedLordPrefabRed;
                }
                else
                {
                    prefab = unmountedLordPrefabRed;
                }
            }

            if (unit.type.Equals("Worker") && unit.color == 0)
            {
                prefab = workerPrefabBlue;
            }

            if (unit.type.Equals("Worker") && unit.color == 1)
            {
                prefab = workerPrefabRed;
            }


            if (unit.type.Equals("Archer") && unit.color == 0)
            {
                prefab = archerPrefabBlue;
            }

            if (unit.type.Equals("Archer") && unit.color == 1)
            {
                prefab = archerPrefabRed;
            }


            if (unit.type.Equals("Swordsman") && unit.color == 0)
            {
                prefab = swordsmanPrefabBlue;
            }

            if (unit.type.Equals("Swordsman") && unit.color == 1)
            {
                prefab = swordsmanPrefabRed;
            }

            if (unit.type.Equals("Spearman") && unit.color == 0)
            {
                prefab = spearmanPrefabBlue;
            }

            if (unit.type.Equals("Spearman") && unit.color == 1)
            {
                prefab = spearmanPrefabRed;
            }

            if (unit.type.Equals("Horseman") && unit.color == 0)
            {
                prefab = horsemanPrefabBlue;
            }

            if (unit.type.Equals("Horseman") && unit.color == 1)
            {
                prefab = horsemanPrefabRed;
            }



            if (unit.type.Equals("Knight") && unit.color == 0)
            {
                if (unit.isMounted)
                {
                    prefab = mountedKnightPrefabBlue;
                }
                else
                {
                    prefab = unmountedKnightPrefabBlue;
                }
            }

            if (unit.type.Equals("Knight") && unit.color == 1)
            {
                if (unit.isMounted)
                {
                    prefab = mountedKnightPrefabRed;
                }
                else
                {
                    prefab = unmountedKnightPrefabRed;
                }
            }


            if (unit.type.Equals("Priest") && unit.color == 0)
            {
                prefab = priestPrefabBlue;
            }

            if (unit.type.Equals("Priest") && unit.color == 1)
            {
                prefab = priestPrefabRed;
            }

            if (unit.type.Equals("Mounted priest") && unit.color == 0)
            {
                prefab = mountedPriestPrefabBlue;
            }

            if (unit.type.Equals("Mounted priest") && unit.color == 1)
            {
                prefab = mountedPriestPrefabRed;
            }

            if (unit.type.Equals("Catapult") && unit.color == 0)
            {
                prefab = catapultPrefabBlue;
            }

            if (unit.type.Equals("Catapult") && unit.color == 1)
            {
                prefab = catapultPrefabRed;
            }

            if (unit.type.Equals("Barrack") && unit.color == 0)
            {
                prefab = barrackPrefabBlue;
            }

            if (unit.type.Equals("Barrack") && unit.color == 1)
            {
                prefab = barrackPrefabRed;
            }

            if (unit.type.Equals("House") && unit.color == 0)
            {
                prefab = housePrefabBlue;
            }

            if (unit.type.Equals("House") && unit.color == 1)
            {
                prefab = housePrefabRed;
            }

            if (unit.type.Equals("Church") && unit.color == 0)
            {
                prefab = churchPrefabBlue;
            }

            if (unit.type.Equals("Church") && unit.color == 1)
            {
                prefab = churchPrefabRed;
            }

            if (unit.type.Equals("Farm") && unit.color == 0)
            {
                prefab = farmPrefabBlue;
            }

            if (unit.type.Equals("Farm") && unit.color == 1)
            {
                prefab = farmPrefabRed;
            }

            if (unit.type.Equals("Mine") && unit.color == 0)
            {
                prefab = minePrefabBlue;
            }

            if (unit.type.Equals("Mine") && unit.color == 1)
            {
                prefab = minePrefabRed;
            }

            if (unit.type.Equals("Quarry") && unit.color == 0)
            {
                prefab = quarryPrefabBlue;
            }

            if (unit.type.Equals("Quarry") && unit.color == 1)
            {
                prefab = quarryPrefabRed;
            }


            if (unit.type.Equals("Bear"))
            {
                prefab = bearPrefab;
            }

            if (unit.type.Equals("Wall"))
            {
                prefab = wallFragmentPrefab;
            }

            if (unit.type.Equals("Tower"))
            {
                prefab = towerPrefab;
            }

            if (unit.type.Equals("Gate"))
            {
                prefab = gatePrefab;
            }
            return prefab;
        }


        public void CaptureBuilding(CaptureUnitAction action)
        {
            Debug.Log("Capture started");
            ChangePrefab(GetPutUnitPrefab(action.enemy), action.enemy);
            Debug.Log("Capture completed");
            ResponseToServer response = new ISeeResponseToServer();
            this.sendOptionsQueue.Enqueue(response);
        }

        public void ChangeUnitState(ChangeStateAction action)
        {
            ChangePrefab(GetPutUnitPrefab(action.unit), action.unit);
            ResponseToServer response = new ISeeResponseToServer();
            this.sendOptionsQueue.Enqueue(response);
        }

        public void ChangePrefab(GameObject newPrefab, Unit unit)
        {
            string id = unit.id;
            GameObject oldObject = models[id];
            GameObject spawnedObject = Instantiate(newPrefab, oldObject.transform.position, oldObject.transform.rotation);
            spawnedObject.transform.localScale = oldObject.transform.localScale;
            models[id] = spawnedObject;
            oldObject.SetActive(false);
        }

        public void HealUnit(HealUnitAction action)
        {


            Debug.Log("Healing started");
            this.damageText.SetActive(true);
            Vector3 enemyPosition = Geometry.GetGlobalPosition(action.enemy.position, hd);
            enemyPosition.y += Geometry.CELL_SIZE * 1f;

            this.damageText.transform.position = enemyPosition;
            this.damageText.GetComponent<TextMesh>().text = "+" + action.surplus;
            this.damageText.GetComponent<TextMesh>().color = Color.green;
            CombinedAnimation comb = new CombinedAnimation();

            Point from = action.from;
            Point to = action.enemy.position;
            double grad = Geometry.GetAngleGradusi(to.x - from.x, to.y - from.y);

            RotateAnimation rotate = new RotateAnimation(this, action.unit, delegate { }, grad);

            ParallelAnimation par = new ParallelAnimation();
            HealAnimation attack = new HealAnimation(this, action.unit, delegate { });
            TakeDamageAnimation damage = new TakeDamageAnimation(this, action.enemy, delegate { });
            DeathAnimation death = new DeathAnimation(this, action.enemy, delegate { });
            par.AddAnimation(attack);


            comb.AddAnimation(rotate);
            comb.AddAnimation(par);


            comb.onDone = delegate
            {
                ResponseToServer response = new ISeeResponseToServer();
                this.sendOptionsQueue.Enqueue(response);
                this.damageText.SetActive(false);
                Debug.Log("Healing completed");
            };

            this.currentAnimations.Add(comb);
        }

        public void AttackUnit(AttackUnitAction action)
        {
            Debug.Log("Attack started");
            this.damageText.SetActive(true);
            Vector3 enemyPosition = Geometry.GetGlobalPosition(action.enemy.position, hd);
            enemyPosition.y += Geometry.CELL_SIZE * 1f;

            this.damageText.transform.position = enemyPosition;
            this.damageText.GetComponent<TextMesh>().text = "-"+action.damage;
            this.damageText.GetComponent<TextMesh>().color = Color.red;


            CombinedAnimation comb = new CombinedAnimation();

            Point from = action.from;
            Point to = action.enemy.position;
            double grad = Geometry.GetAngleGradusi(to.x - from.x, to.y - from.y);

            RotateAnimation rotate = new RotateAnimation(this, action.unit, delegate { }, grad);

            ParallelAnimation par = new ParallelAnimation();
            AttackAnimation attack = new AttackAnimation(this, action.unit, delegate { });
            TakeDamageAnimation damage = new TakeDamageAnimation(this, action.enemy, delegate { });
            DeathAnimation death = new DeathAnimation(this, action.enemy, delegate { });
            par.AddAnimation(attack);

            if (action.kills)
            {
                par.AddAnimation(death);
            }
            else
            {
                par.AddAnimation(damage);
            }


            comb.AddAnimation(rotate);
            comb.AddAnimation(par);


            comb.onDone = delegate
            {
                if (action.kills)
                {
                    GameObject model = models[action.enemy.id];


                    if (action.enemy.type.Equals("Tower"))
                    {
                        Vector3 oldPos = Geometry.GetGlobalPosition(action.enemy.position, hd);
                        GameObject go = null;
                        foreach (var m in models)
                        {
                            GameObject mmm = m.Value;
                            Vector3 loc = mmm.transform.position;
                            float dist = Vector3.Distance(loc, oldPos);
                            if (dist < 0.1)
                            {
                                go = mmm;
                            }
                        }

                        hd.RemoveTower(action.enemy.position);

                        if (go != null)
                        {
                            Vector3 newPos = Geometry.GetGlobalPosition(action.enemy.position, hd);
                            go.transform.position = newPos;
                            Debug.Log(oldPos);
                            Debug.Log(newPos);
                        }
                    }

                    model.SetActive(false);
                }

                ResponseToServer response = new ISeeResponseToServer();
                this.sendOptionsQueue.Enqueue(response);
                this.damageText.SetActive(false);
                Debug.Log("Attack completed");
            };

            this.currentAnimations.Add(comb);
        }

        public void AppearUnit(Unit unit)
        {
            PutUnit(unit);
            ResponseToServer response = new ISeeResponseToServer();
            this.sendOptionsQueue.Enqueue(response);
        }


        public void ControlUnits()
        {
            List<Animation> newAnimations = new List<Animation>();
            for (int i = 0; i < currentAnimations.Count; i++)
            {
                currentAnimations[i].Go();

                if (!currentAnimations[i].expired)
                {
                    newAnimations.Add(currentAnimations[i]);
                }
            }
            this.currentAnimations = newAnimations;
        }


        public static List<PathFragment> SplitPath(List<PathFragment> path)
        {
            List<PathFragment> res = new List<PathFragment>();

            double currentDirection = path[0].GetAngle();
            Point from = path[0].from;
            for (int i = 0; i < path.Count; i++)
            {
                double direction = path[i].GetAngle();
                if (direction != currentDirection)
                {
                    currentDirection = direction;
                    PathFragment frag = new PathFragment(from, path[i].from);
                    from = path[i].from;
                    res.Add(frag);
                }
            }

            {
                PathFragment frag = new PathFragment(from, path[path.Count - 1].to);
                res.Add(frag);
            }

            return res;
        }

    }
}
