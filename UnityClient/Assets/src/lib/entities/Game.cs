using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Assets.src.lib.entities
{
    public class Game
    {
        public Treasury whiteTreasury { get; set; }
        public Treasury blackTreasury { get; set; }
        public List<Unit> units { get; set; }
        public int unitPointer { get; set; }
        public List<List<Unit>> matrix { get; set; }
        public List<List<Unit>> towers { get; set; }
        public Unit whiteKing { get; set; }
        public Unit blackKing { get; set; }
        public Map map { get; set; }
    }
}
