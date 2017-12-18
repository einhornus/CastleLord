using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Assets.src.lib.entities;


namespace Assets.src.lib.action
{
    public class HealUnitAction : Action
    {
        public Unit unit { get; set; }
        public Point from { get; set; }
        public Point to { get; set; }
        public Unit enemy { get; set; }
        public int surplus { get; set; }
    }
}
