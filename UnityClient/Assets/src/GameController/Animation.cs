using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using Quobject.SocketIoClientDotNet.Client;
using Newtonsoft.Json;
using Assets.src.lib.entities;
using Assets.src.lib.action;
using Assets.src.lib.geometry;
using System.Threading;
using System;
using Assets.src.lib.geometry;
using Assets.src.lib;

namespace Assets.src.GameController
{

    public class Animation
    {
        public static double DEFAULT_SPEED = 0.2;


        public CombinedAnimation father = null;
        protected Unit unit;
        protected GameControllerBehavior environment;
        protected double phase;
        protected double speed = DEFAULT_SPEED;
        public System.Action<string> onDone;


        public Animation(GameControllerBehavior environment, Unit unit, System.Action<string> onDone)
        {
            this.unit = unit;
            this.environment = environment;
            this.onDone = onDone;
        }

        public virtual void Apply()
        {

        }



        public bool expired = false;

        public GameObject GetGameObject()
        {
            return environment.models[unit.id];
        }

        public virtual void Go()
        {
            this.speed = GetAnimationSpeed();
            this.phase += speed*environment.GAME_SPEED;

            GameObject obj = GetGameObject();
            if (phase < 1.0)
            {
                string clip = GetClip();
                Animator animator = obj.GetComponent<Animator>();
                if (animator != null)
                {
                    animator.speed = (float)environment.GAME_SPEED;
                    animator.Play(GetClip());
                }
                Apply();
            }
            else
            {
                Apply();
                expired = true;
                Animator animator = obj.GetComponent<Animator>();
                if (animator != null)
                {
                    animator.Play("idle");
                    animator.speed = (float)environment.GAME_SPEED;
                }
                onDone("abc");
            }
        }

        public virtual string GetClip()
        {
            return "null";
        }

        public virtual double GetAnimationSpeed()
        {
            return DEFAULT_SPEED;
        }
    }

    public class MoveAnimation : Animation
    {
        public MoveAnimation(GameControllerBehavior environment, Unit unit, System.Action<string> onDone, Point start, Point end) : base(environment, unit, onDone)
        {
            this.start = start;
            this.end = end;
        }



        private Point start;
        private Point end;
        private double MOVE_SPEED = DEFAULT_SPEED * 0.5;

        public override double GetAnimationSpeed()
        {
            Vector3 pos1 = Geometry.GetGlobalPosition(start, environment.hd);
            Vector3 pos2 = Geometry.GetGlobalPosition(end, environment.hd);
            double d = Vector3.Distance(pos1, pos2);
            return MOVE_SPEED / d;
        }

        public override void Apply()
        {
            double x = start.x * (1f - phase) + end.x * phase;
            double y = start.y * (1f - phase) + end.y * phase;
            Vector3 pos = Geometry.GetGlobalPosition((float)x, (float)y, environment.hd);
            {
                environment.CameraPointToPoint(new Point((float)x, (float)y));
            }
            GameObject obj = GetGameObject();
            obj.GetComponent<Transform>().localPosition = pos;
        }

        public override string GetClip()
        {
            return "run";
        }
    }


    public class AttackAnimation : Animation
    {
        public AttackAnimation(GameControllerBehavior environment, Unit unit, System.Action<string> onDone) : base(environment, unit, onDone)
        {
        }

        public override void Apply()
        {
            //environment.FocusOn(unit.position.x, unit.position.y);
        }

        public override string GetClip()
        {
            return "attack";
        }

        public override double GetAnimationSpeed()
        {
            return 0.008;
        }
    }


    public class HealAnimation : Animation
    {
        public HealAnimation(GameControllerBehavior environment, Unit unit, System.Action<string> onDone) : base(environment, unit, onDone)
        {
        }

        public override void Apply()
        {
            environment.FocusOn(unit.position.x, unit.position.y);
        }

        public override string GetClip()
        {
            return "attack";
        }

        public override double GetAnimationSpeed()
        {
            return 0.008;
        }
    }

    public class TakeDamageAnimation : Animation
    {
        public TakeDamageAnimation(GameControllerBehavior environment, Unit unit, System.Action<string> onDone) : base(environment, unit, onDone)
        {
        }

        public override void Apply()
        {
        }

        public override string GetClip()
        {
            return "damage";
        }

        public override double GetAnimationSpeed()
        {
            return 0.008;
        }
    }

    public class DeathAnimation : Animation
    {
        public DeathAnimation(GameControllerBehavior environment, Unit unit, System.Action<string> onDone) : base(environment, unit, onDone)
        {
        }


        public override void Apply()
        {
            GameObject obj = GetGameObject();
            if (this.phase > 0.9)
            {
                obj.SetActive(false);
            }
        }

        public override string GetClip()
        {
            return "death";
        }

        public override double GetAnimationSpeed()
        {
            return 0.008;
        }
    }

    public class RotateAnimation : Animation
    {
        public double angle;

        private double? initialAngle = null;
        private double vector = 0;
        private double sp = DEFAULT_SPEED;

        public static double ANGULAR_SPEED = DEFAULT_SPEED * 100;

        public RotateAnimation(GameControllerBehavior environment, Unit unit, System.Action<string> onDone, double _angle) : base(environment, unit, onDone)
        {
            if (_angle < 0)
            {
                _angle += 360;
            }

            this.angle = _angle;
        }

        public override double GetAnimationSpeed()
        {
            return sp;
        }

        public override string GetClip()
        {
            return "idle";
        }

        public override void Apply()
        {
            //environment.FocusOn(unit.position.x, unit.position.y);

            GameObject obj = GetGameObject();
            if (phase >= 1.0)
            {
                Geometry.SetRotationY(obj, angle);
                return;
            }

            if (initialAngle == null)
            {
                double govno = Geometry.GetRotationY(obj);
                if (govno < 0)
                {
                    govno += 360;
                }
                this.initialAngle = govno;
                double d1 = Math.Abs(angle - initialAngle.Value);
                double d2 = 360 - Math.Abs(angle - initialAngle.Value);
                double rot = Math.Abs(Math.Min(d1, d2));
                sp = ANGULAR_SPEED / (rot + 0.1) / 3.0;
            }
            else
            {
                double need = 0;

                double d1 = Math.Abs(angle - initialAngle.Value);
                double d2 = 360 - Math.Abs(angle - initialAngle.Value);

                if (d1 <= d2)
                {
                    need = initialAngle.Value * (1f - phase) + angle * phase;
                }
                else
                {
                    if (initialAngle > angle)
                    {
                        need = (initialAngle.Value) * (1f - phase) + (angle + 360) * phase;
                    }
                    else
                    {
                        need = (initialAngle.Value + 360) * (1f - phase) + (angle) * phase;
                    }
                }

                if (need < 0)
                {
                    need += 360;
                }

                if (need >= 360)
                {
                    need -= 360;
                }

                //Debug.Log(need);

                Geometry.SetRotationY(obj, need);
            }
        }
    }

    public class CombinedAnimation : Animation
    {
        public List<Animation> animations = new List<Animation>();
        public int currentIndex = 0;

        public CombinedAnimation() : base(null, null, null)
        {

        }

        public void AddAnimation(Animation animation)
        {
            animation.father = this;
            this.animations.Add(animation);

            if (this.animations.Count > 1)
            {
                Animation prelastAnimation = animations[animations.Count - 2];
                prelastAnimation.onDone = delegate
                {
                    prelastAnimation.father.currentIndex++;
                };
            }

            animation.onDone = delegate
            {
                animation.father.expired = true;
                animation.father.onDone("a");
            };
        }

        public override void Go()
        {


            animations[currentIndex].Go();
        }
    }



    public class ParallelAnimation : Animation
    {
        public List<Animation> animations = new List<Animation>();

        public ParallelAnimation() : base(null, null, null)
        {

        }

        public void AddAnimation(Animation animation)
        {
            this.animations.Add(animation);
            animation.onDone = delegate
            {

            };
        }

        public override void Go()
        {
            for (int i = 0; i < animations.Count; i++)
            {
                bool notExpired = false;
                if (!animations[i].expired)
                {
                    animations[i].Go();
                    notExpired = true;
                }

                if (!notExpired && !this.expired)
                {
                    this.expired = true;
                    onDone("abc");
                }
            }
        }
    }



}
