
export type TypeFormatJSON<T, J> = {
    obj:{[key in keyof T]: any},
    correspondance:{[key in keyof T]?: keyof J}
}

export function formatJSON<T,J>({obj, correspondance}:TypeFormatJSON<T, J>): {[key in keyof J]:any} {
    
    let objEmpty:{[key in ((keyof T)| (keyof J)) ]:any} = {} as any;

    Object.keys(obj as any).forEach((key)=>{
        let key1:keyof T = key as any;
        let newKey = correspondance[key1];
        if(newKey!=undefined ){
            objEmpty[newKey as keyof J] = obj[key1]
        }else{
            objEmpty[key1] = obj[key1]
        }
    })

    return objEmpty;
}