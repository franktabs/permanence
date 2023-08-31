import { Pipe, PipeTransform } from "@angular/core";
// import * as dayJs from "dayjs";
// import * as relativeTime from "dayjs/plugin/relativeTime";
// dayJs.extend(relativeTime)

@Pipe({
    name:"dayJs"
})
export class DayJsPipe implements PipeTransform{

    transform(value: any, method: "fromNow"|"toNow", withoutSuffix:boolean=false):string|null {
        // if(!value) return ""
        // if(method==="fromNow"){
        //     return dayJs(value).locale("fr-FR").fromNow(withoutSuffix)
        // }else if(method==="toNow"){
        //     return dayJs(value).locale("fr-FR").to(null,withoutSuffix)
        // }
        return null
    }

}