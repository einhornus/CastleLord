using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Assets.src.lib.entities;


namespace Assets.src.lib.action
{
    public class AttackUnitAction : Action
    {
        public Unit unit { get; set; }
        public Point from { get; set; }
        public Point to { get; set; }
        public bool kills { get; set; }
        public Unit enemy { get; set; }
        public int damage { get; set; }
        public int weapon { get; set; }
        public int armour { get; set; }
    }
}
