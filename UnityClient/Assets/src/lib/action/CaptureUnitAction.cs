using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Assets.src.lib.entities;


namespace Assets.src.lib.action
{
    public class CaptureUnitAction : Action
    {
        public Unit unit { get; set; }
        public Unit enemy { get; set; }
    }
}
