import * as types from "./actionType";

export const InventoryLogin=(Inventory)=>{
    return{
        type:types.INVENTORY_LOGIN_SUCCESS,
        payload:Inventory
    }
}


export const InventoryLogout=()=>{
    return{
        type:types.INVENTORY_LOGOUT_SUCCESS
    }
}


export const InventoryLoginRequest=()=>{

    return{
        type:types.INVENTORY_LOGIN_REQUEST
    };
};


export const InventoryLoginFailure=()=>{
    return{
        type:types.INVENTORY_LOGIN_FAILURE
    };
}

