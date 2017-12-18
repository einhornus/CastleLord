using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using Quobject.SocketIoClientDotNet.Client;
using Newtonsoft.Json;
using Assets.src.lib.entities;
using Assets.src.lib.action;
using Assets.src.lib.geometry;
using Assets.src.lib;
using System;

namespace Assets.src.GameController
{
    public partial class GameControllerBehavior : MonoBehaviour
    {
        public GameObject treasuryFood;
        public GameObject treasuryGold;
        public GameObject treasuryStone;
        public GameObject treasuryIron;

        public GameObject treasuryFoodIncome;
        public GameObject treasuryGoldIncome;
        public GameObject treasuryStoneIncome;
        public GameObject treasuryIronIncome;


        public GameObject treasuryFoodIcon;
        public GameObject treasuryGoldIcon;
        public GameObject treasuryStoneIcon;
        public GameObject treasuryIronIcon;


        //public GameObject treasuryFoodIncome;
        //public GameObject treasuryGoldIncome;
        //public GameObject treasuryStoneIncome;
        //public GameObject treasuryIronIncome;


        private int currentTreasuryGold;
        private int currentTreasuryIron;
        private int currentTreasuryStone;
        private int currentTreasuryFood;

        public void SetTreasuryIncome(GameObject component, double income)
        {
            TextMesh tm = component.GetComponent<TextMesh>();
            if (income > 0)
            {
                tm.text = "+" + income + "";
                tm.color = Color.green;
            }
            else
            {
                tm.text = income + "";
                if (income == 0)
                {
                    tm.color = Color.yellow;
                }
                else
                {
                    tm.color = Color.red;
                }
            }
        }

        public void SetTreasury(YourMoveAction yma)
        {
            treasuryFood.GetComponent<TextMesh>().text = yma.foodAmount+"";
            treasuryGold.GetComponent<TextMesh>().text = yma.goldAmount + "";
            treasuryStone.GetComponent<TextMesh>().text = yma.stoneAmount + "";
            treasuryIron.GetComponent<TextMesh>().text = yma.ironAmount + "";

            SetTreasuryIncome(treasuryFoodIncome, yma.foodIncome);
            SetTreasuryIncome(treasuryStoneIncome, yma.stoneIncome);
            SetTreasuryIncome(treasuryGoldIncome, yma.goldIncome);
            SetTreasuryIncome(treasuryIronIncome, yma.ironIncome);
        }

        public void UpdateTreasury()
        {
            AttachGameObjectToUIScreenPoint(treasuryGoldIcon, 0.05f, 0.9f, 0.5f, false);
            AttachGameObjectToUIScreenPoint(treasuryFoodIcon, 0.1f, 0.9f, 0.5f, false);
            AttachGameObjectToUIScreenPoint(treasuryIronIcon, 0.15f, 0.9f, 0.5f, false);
            AttachGameObjectToUIScreenPoint(treasuryStoneIcon, 0.2f, 0.9f, 0.5f, false);

            AttachGameObjectToUIScreenPoint(treasuryGold, 0.05f, 0.86f, 0.5f, true);
            AttachGameObjectToUIScreenPoint(treasuryFood, 0.1f, 0.86f, 0.5f, true);
            AttachGameObjectToUIScreenPoint(treasuryIron, 0.15f, 0.86f, 0.5f, true);
            AttachGameObjectToUIScreenPoint(treasuryStone, 0.2f, 0.86f, 0.5f, true);

            AttachGameObjectToUIScreenPoint(treasuryGoldIncome, 0.05f, 0.82f, 0.5f, true);
            AttachGameObjectToUIScreenPoint(treasuryFoodIncome, 0.1f, 0.82f, 0.5f, true);
            AttachGameObjectToUIScreenPoint(treasuryIronIncome, 0.15f, 0.82f, 0.5f, true);
            AttachGameObjectToUIScreenPoint(treasuryStoneIncome, 0.2f, 0.82f, 0.5f, true);
        }
    }
}