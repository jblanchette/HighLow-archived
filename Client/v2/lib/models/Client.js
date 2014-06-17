define(['underscore', 'BaseModel'], function(_, BaseModel) {

    function ClientModel() {
        var Model = new BaseModel();
        var defaultObject = {
            Info : {
                nickname : ""
            },
            Privledges : {
                isAdmin : false
            },
            // Hash Object: { roomID, roomOptions }
            ChatLobbies : {},
            GameLobby : {},
            GameData : {}
        };

        Model.defaults(defaultObject);
    }


    return ClientModel;
});