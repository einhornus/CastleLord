using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json;
using UnityEngine;
using Assets.src.lib.entities;

namespace Assets.src.lib.move
{
    public class Move
    {
        public string type { get; set; }

        public Point start { get; set; }
        public Point target { get; set; }

        public Point end { get; set; }
        public List<PathFragment> path { get; set; }
        public Point point { get; set; }

        public Unit unit { get; set; }

        public Unit enemy { get; set; }

        public Unit recruit { get; set; }
        public Unit host { get; set; }
    }
}
