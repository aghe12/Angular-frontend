class UIButton{
    callback=null;
    addEventListener(callback){
        this;
    }
    click(){
        if(this.callback){
            this.callback("Clicked", "Button");
        }
    }
}
class SomeClass {
 name = 'Angular';

 constructor(aButton){
    this.aButton=aButton;
    this.printName=this.printName.bind(this);
    this.aButton.addEventListener(this.printName.bind(this)); //bind is needed only for the funs created using function keyword, not for arrow func
 }
  

  printName(prefix, suffix) {
    console.log('hello world',prefix, ':', this.name) ,":", suffix;
  }

// printName=(prefix, suffix)=> {
//     console.log('hello world',prefix, ':', this.name) ,":", suffix;
//   }


}

const student={
    name:'megha',
    dob:'2005-12-1',

};
const aButton=new UIButton();
aButton.click();

// const someObj = new SomeClass();

// const printFc = someObj.printName;

// // Correct way to invoke with proper `this`
// printFc.apply(someObj,['Second']); // hello world Angular

// // // This will lose `this`
// // printFc(); // hello world undefined

// printFc.apply(student,['Third','Suffix']); //bad to use
// printFc.call(someObj,'second', 'Suffix');


