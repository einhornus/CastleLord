using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Assets.src.lib.entities;

namespace Assets.src.lib.action
{
    public class ChangeStateAction : Action
    {
        public Unit unit { get; set; }
    }
}
