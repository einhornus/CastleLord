using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json;
using UnityEngine;

namespace Assets.src.lib.action
{
    public class Action
    {
        public string type { get; set; }

        public static Action Parse(string data)
        {
            Action root = JsonConvert.DeserializeObject<Action>(data);
            if (root.type.Equals("Appear unit"))
            {
                AppearUnitAction res = JsonConvert.DeserializeObject<AppearUnitAction>(data);
                return res;
            }

            if (root.type.Equals("Heal unit"))
            {
                HealUnitAction res = JsonConvert.DeserializeObject<HealUnitAction>(data);
                return res;
            }


            if (root.type.Equals("Capture building"))
            {
                CaptureUnitAction res = JsonConvert.DeserializeObject<CaptureUnitAction>(data);
                return res;
            }

            if (root.type.Equals("Disappear unit"))
            {
                AppearUnitAction res = JsonConvert.DeserializeObject<AppearUnitAction>(data);
                return res;
            }

            if (root.type.Equals("Init game"))
            {
                InitGameAction res = JsonConvert.DeserializeObject<InitGameAction>(data);
                return res;
            }

            if (root.type.Equals("Move unit"))
            {
                MoveUnitAction res = JsonConvert.DeserializeObject<MoveUnitAction>(data);
                return res;
            }

            if (root.type.Equals("Your move"))
            {
                YourMoveAction res = JsonConvert.DeserializeObject<YourMoveAction>(data);
                return res;
            }

            if (root.type.Equals("Attack unit"))
            {
                AttackUnitAction res = JsonConvert.DeserializeObject<AttackUnitAction>(data);
                return res;
            }

            if (root.type.Equals("Change state"))
            {
                ChangeStateAction res = JsonConvert.DeserializeObject<ChangeStateAction>(data);
                return res;
            }

            Debug.Log("Can't parse: " + data);
            throw new ArgumentException();
        }
    }



}
