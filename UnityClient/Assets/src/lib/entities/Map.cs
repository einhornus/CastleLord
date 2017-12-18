using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Assets.src.lib.entities
{
    public class Map
    {
        public int initialWhiteGold { get; set; }
        public int initialBlackGold { get; set; }
        public int initialWhiteStone { get; set; }
        public int initialBlackStone { get; set; }
        public Point initialWhiteKingPosition { get; set; }
        public Point initialBlackKingPosition { get; set; }
        public int width { get; set; }
        public int height { get; set; }
        public List<List<bool>> passable { get; set; }
        public List<List<bool>> stoneDeposits { get; set; }
        public List<List<bool>> goldDeposits { get; set; }
        public Castle whiteCastle { get; set; }
        public Castle blackCastle { get; set; }
        public List<Unit> initialTroops { get; set; }



        public List<Point> landscapeWater { get; set; }
        public List<Point> landscapeGoldDeposits { get; set; }
        public List<Point> landscapeIronDeposits { get; set; }
        public List<Point> landscapeStoneDeposits { get; set; }
        public List<Point> landscapeTrees { get; set; }
    }
}
