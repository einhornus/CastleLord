using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Assets.src.lib
{
    public class Point
    {
        public float x { get; set; }
        public float y { get; set; }

        public Point(float x, float y)
        {
            this.x = x;
            this.y = y;
        }

        public static double Dist(float x1, float y1, float x2, float y2)
        {
            return Math.Sqrt((x1-x2)*(x1 - x2) + (y1 - y2) * (y1 - y2));
        }
    }
}
