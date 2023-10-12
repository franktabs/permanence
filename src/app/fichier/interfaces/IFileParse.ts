

export abstract class IFileParse{

    abstract parseCSV(csvData: string):any

    clearStringEmpty(table:Array<any>):Array<any>{

        let tabs:Array<any> = JSON.parse(JSON.stringify(table))
        if(table instanceof Array && table.length){
            let i = 0
            for(let line of table){

                let keys = Object.keys(line);
                let clear = true;
                if(keys.length){
                    for(let key of keys){
                        if(line[key]){
                            clear = false;
                            break;
                        }
                    }
                    if(clear){
                        tabs.splice(i, 1)
                        i--;
                    }
                }
                i++;
            }
        }
        return tabs;
    }
}
