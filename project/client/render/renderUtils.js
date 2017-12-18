var PICS = {
    DEFAULT:"images/image.jpg",
    IMPASSABLE:"images/impassable",

    UNITS:{
        KING:{
            WHITE:"images/units/king/king_red.png",
            BLACK:"images/units/king/king_blue.png"
        },

        PEASANT:{
            WHITE:"images/units/peasant/peasant_red.png",
            BLACK:"images/units/peasant/peasant_blue.png"
        },

        BUILDER:{
            WHITE:"images/units/builder/builder_red.png",
            BLACK:"images/units/builder/builder_blue.png"
        },


        SWORDSMAN:{
            WHITE:"images/units/swordsman/swordsman_red.png",
            BLACK:"images/units/swordsman/swordsman_blue.png"
        },

    },

    MAP:{
        IMPASSABLE : "TODO"
    },

    CASTLE:{
        WALL : {
            WHITE:"TODO",
            BLACK:"TODO"
        },

        TOWER : {
            WHITE:"TODO",
            BLACK:"TODO"
        },

        GATE : {
            WHITE:"TODO",
            BLACK:"TODO"
        },
    }
};


var getPicOfUnit = function(unit){
    if(unit === null){
        return PICS.DEFAULT;
    }

    if(unit.type === "King"){
        if(unit.color === 0){
            return PICS.UNITS.KING.WHITE;
        }
        else{
            return PICS.UNITS.KING.BLACK;
        }
    }

    if(unit.type === "Builder"){
        if(unit.color === 0){
            return PICS.UNITS.BUILDER.WHITE;
        }
        else{
            return PICS.UNITS.BUILDER.BLACK;
        }
    }

    if(unit.type === "Peasant"){
        if(unit.color === 0){
            return PICS.UNITS.PEASANT.WHITE;
        }
        else{
            return PICS.UNITS.PEASANT.BLACK;
        }
    }

    if(unit.type === "Swordsman"){
        if(unit.color === 0){
            return PICS.UNITS.SWORDSMAN.WHITE;
        }
        else{
            return PICS.UNITS.SWORDSMAN.WHITE;
        }
    }
}






