using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;
using Assets.src.lib.geometry;
using System.Collections;


namespace Assets.src.GameController
{
    public class Clickable
    {
        public GameObject obj;
        public Vector3 normalSize = new Vector3(7, 7, 7);
        public Vector3 hoveredSize = new Vector3(7, 7, 7);
        public Vector3 pressedSize = new Vector3(7, 7, 7);
        public string id;
        public GameObject prefab;

        public double normalK;
        public double hoveredK;
        public double pressedK;


        public Clickable(GameObject prefab, string id, double normalK, double hoveredK, double pressedK)
        {
            this.prefab = prefab;
            this.id = id;
            Vector3 prefabScale = prefab.transform.localScale;
            normalSize = prefabScale * (float)normalK;
            hoveredSize = prefabScale * (float)hoveredK;
            pressedSize = prefabScale * (float)pressedK;

            this.normalK = normalK;
            this.hoveredK = hoveredK;
            this.pressedK = pressedK;
        }
    }

    public class ClickableObjectCollectionPack
    {
        public class BestClickable
        {
            public double distance = Double.MaxValue;
            public Clickable clickable = null;

            public bool TryUpdate(Clickable c, double distance)
            {
                if (distance < this.distance)
                {
                    this.distance = distance;
                    clickable = c;
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }

        public static double DISTANCE_LIMIT = 200;
        public List<ClickableObjectCollection> pack = new List<ClickableObjectCollection>();


        public void Update()
        {
            BestClickable bcForHover = new BestClickable();
            BestClickable[] bcForPress = new BestClickable[pack.Count];

            for (int i = 0; i<pack.Count; i++)
            {
                bcForPress[i] = new BestClickable();
            }

            for (int i = 0; i < pack.Count; i++)
            {
                foreach (Clickable c in pack[i].clickables)
                {
                    GameObject ob = c.obj;
                    Vector3 screenPointObject = Camera.main.WorldToScreenPoint(ob.transform.localPosition);
                    Vector3 mousePoint = new Vector3(Input.mousePosition.x, Input.mousePosition.y, 0);

                    double distance = Vector3.Distance(screenPointObject, mousePoint);

                    if (distance < DISTANCE_LIMIT)
                    {
                        bcForHover.TryUpdate(c, distance);
                        if (Input.GetMouseButtonUp(0))
                        {
                            bcForPress[i].TryUpdate(c, distance);
                        }
                    }
                }
            }


            for (int i = 0; i < pack.Count; i++)
            {
                if (bcForPress[i].clickable != null)
                {
                    if (bcForPress[i].clickable == bcForHover.clickable)
                    {
                        if (bcForPress[i].clickable != pack[i].pressedClickable)
                        {
                            pack[i].pressedClickable = bcForPress[i].clickable;
                            pack[i].onClick(pack[i].pressedClickable.id);
                        }
                        else
                        {

                        }
                    }
                }
            }

            for (int i = 0; i < pack.Count; i++)
            { 
                foreach (Clickable c in pack[i].clickables)
                {
                    c.obj.transform.localScale = c.normalSize;

                    if (bcForHover.clickable != null) {
                        if (bcForHover.clickable == c)
                        {
                            c.obj.transform.localScale = c.hoveredSize;
                        }
                    }

                    if (pack[i].pressedClickable == c)
                    {
                        c.obj.transform.localScale = c.pressedSize;
                    }
                }
            }
        }
    }

    public class ClickableObjectCollection
    {
        public Action<string> onClick;
        public List<Clickable> clickables = new List<Clickable>();
        private ClickableObjectCollectionPack parent;
        public Clickable pressedClickable = null;

        public void SetPressed(int index)
        {
            this.pressedClickable = clickables[index];
            clickables[index].obj.transform.localScale = clickables[index].pressedSize;
        }

        public ClickableObjectCollection(Action<string> onClick, ClickableObjectCollectionPack parent)
        {
            this.onClick = onClick;
            this.parent = parent;
            this.parent.pack.Add(this);
        }

        public void Add(Clickable clickable, Vector3 pos)
        {
            GameObject spawnedObject = GameControllerBehavior.Instantiate<GameObject>(clickable.prefab, pos, clickable.prefab.transform.rotation);
            clickable.obj = spawnedObject;
            clickables.Add(clickable);
            spawnedObject.transform.localScale = clickable.normalSize;
        }

        public void Clear()
        {
            for (int i = 0; i < clickables.Count; i++)
            {
                GameControllerBehavior.Destroy(clickables[i].obj);
            }
            clickables = new List<Clickable>();
            this.pressedClickable = null;
        }
    }
}
