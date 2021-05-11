module.exports = {
    bitwiseEmojis: {
        0: "<:None:612400808289501212> ",           //no mod
        1: "<:NoFail:612400808209940491> ",         //no fail
        2: "<:Easy:612400807991705621>",            //easy
        4: "<:TouchDevice:612400808302215215>",     //touch device
        8: "<:Hidden:612400808377712650>",          //hidden
        16: "<:HardRock:612400808335638578>",       //hard rock
        32: "<:SuddenDeath:612400808167866390>",    //sudden death
        64: "<:DoubleTime:612400808444559509>",     //double time
        128: "<:Relax:612400808130248719>",         //relax
        256: "<:HalfTime:612400808373387304>",      //half time
        512: "<:Nightcore:612400808444559527>",     //nightcore (576)
        1024: "<:Flashlight:612400808130248718>",   //flashlight
        2048: "<:Autoplay:612400808402747404>",     //auto
        4096: "<:SpunOut:612400808448753875>",      //spunout
        8192: "<:Relax2:612400808444559565>",       //autopilot
        16384: "<:Perfect:612400808537096232>",     //perfect (16416)
        32768: "<:Key4:612400808092368921>",        //key4
        65536: "<:Key5:612400808058683404>",        //key5
        131072: "<:Key6:612400808310472714>",       //key6
        262144: "<:Key7:612402225691623424>",       //key7
        524288: "<:Key8:612400808444821560>",       //key8
        1048576: "<:FadeIn:612400808536834078>",    //fadein
        2097152: "<:Random:612400808423849994>",    //random
        4194304: "<:Cinema:612400808298020894>",    //cinema
        8388608: "<:Target:612400808457142400>",    //target
        16777216: "<:Key9:612400808809594885>",     //key9
        33554432: "<:KeyCoop:612400808834760850>",  //keycoop
        67108864: "<:Key1:612400808281112601>",     //key1
        134217728: "<:Key2:612400809660907561>",    //key2
        268435456: "<:Key3:612400808306409495>",    //key3
        536870912: "<:ScoreV2:612404195357622272>", //scorev2
        1073741824: "Mirror"                        //mirror
    },
    bitwise: {
        None           : 0,
        NoFail         : 1,
        Easy           : 2,
        TouchDevice    : 4,
        Hidden         : 8,
        HardRock       : 16,
        SuddenDeath    : 32,
        DoubleTime     : 64,
        Relax          : 128,
        HalfTime       : 256,
        Nightcore      : 512, // Nightcore in theory always comes with DT
        Flashlight     : 1024,
        Autoplay       : 2048,
        SpunOut        : 4096,
        Relax2         : 8192,	// Autopilot
        Perfect        : 16384, // Only set along with SuddenDeath. i.e: PF only gives 16416  
        Key4           : 32768,
        Key5           : 65536,
        Key6           : 131072,
        Key7           : 262144,
        Key8           : 524288,
        FadeIn         : 1048576,
        Random         : 2097152,
        Cinema         : 4194304,
        Target         : 8388608,
        Key9           : 16777216,
        KeyCoop        : 33554432,
        Key1           : 67108864,
        Key3           : 134217728,
        Key2           : 268435456,
        ScoreV2        : 536870912,
        LastMod        : 1073741824,
        KeyMod : 67108864 | 268435456 | 134217728 | 32768 | 65536 | 131072 | 262144 | 524288 | 16777216 | 33554432,
        FreeModAllowed : 1 | 2 | 8 | 16 | 32 | 1024 | 1048576 | 128 | 8192 | 4096 | 67108864 | 268435456 | 134217728 | 32768 | 65536 | 131072 | 262144 | 524288 | 16777216 | 33554432,
        ScoreIncreaseMods : 8 | 16 | 64 | 1024 | 1048576
    },
    gameMods: ["vn", "ap", "rx"]
}
