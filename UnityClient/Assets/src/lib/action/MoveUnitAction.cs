using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Assets.src.lib.entities;


namespace Assets.src.lib.action
{
    public class MoveUnitAction : Action
    {
        public Unit unit { get; set; }
        public List<PathFragment> path { get; set; }
        public Point to;
        public Point from;
    }
}
