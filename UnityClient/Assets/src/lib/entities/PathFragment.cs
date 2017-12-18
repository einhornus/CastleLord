using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Assets.src.lib.geometry;

namespace Assets.src.lib.entities
{
    public class PathFragment
    {
        public Point from { get; set; }
        public Point to { get; set; }

        public double GetAngle()
        {
            double grad = Geometry.GetAngleGradusi(to.x - from.x, to.y - from.y);
            return grad;
        }

        public PathFragment(Point from, Point to)
        {
            this.from = from;
            this.to = to;
        }
    }
}
