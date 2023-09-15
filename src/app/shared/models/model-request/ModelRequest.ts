export default abstract class ModelRequest<T> {
  public isError: boolean = false;
  public isLoading: boolean = false;
  public isEnd: boolean = false;

  constructor(public data: T) {}

  public error() {
    this.isEnd = true;
    this.isLoading = false;
    this.isError = true;
  }

  public success() {
    this.isEnd = true;
    this.isLoading = false;
    this.isError = false;
  }

  public loading() {
    this.isEnd = false;
    this.isLoading = true;
    this.isError = false;
  }

  public setData(datas:T){
    this.data = datas;
  }

  public getData(){
    return this.data;
  }

  public hasError(): boolean {
    if (
      (this.isEnd = true && this.isLoading == false && this.isError == true)
    ) {
      return true;
    }
    return false;
  }
  public hasLoading(): boolean {
    if (
      (this.isEnd = false && this.isLoading == true && this.isError == false)
    ) {
      return true;
    }
    return false;
  }
  public hasSuccess(): boolean {
    if (
      (this.isEnd = true && this.isLoading == false && this.isError == false)
    ) {
      return true;
    }
    return false;
  }


  public hasTraited(): boolean {
    if (
      (this.isEnd = false && this.isLoading == false && this.isError == false)
    ) {
      return false;
    }
    return true;
  }
}
