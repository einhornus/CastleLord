using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Assets.src.lib.entities;
using Assets.src.lib.move;


namespace Assets.src.lib.action
{
    public class YourMoveAction : Action
    {
        public List<Move> moves { get; set; }
        public Unit unit { get; set; }

        public List<Unit> units { get; set; }

        public int foodIncome { get; set; }
        public int goldIncome { get; set; }
        public int ironIncome { get; set; }
        public int stoneIncome { get; set; }

        public int foodAmount { get; set; }
        public int goldAmount { get; set; }
        public int ironAmount { get; set; }
        public int stoneAmount { get; set; }

        public List<Obstacle> obstacles { get; set; }
        public int width;
        public int height;
    }
}
