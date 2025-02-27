<style scoped>
  .custom-color{
    /*background-color: #ffffff1e;*/
    background-color: #959595;
  }
  .title {
    text-align: center;
    padding: 30px;
    color: #e7e7e7;
  }
  .content{
    border-radius: 10px;
    width: 90%;
    max-width: 1000px;
    /*
    box-shadow: 3px 3px 9px 0px;
    border-color: rgba(255, 255, 255, 0.137);
    border-width: 1px;
    border-style: solid;
    */
  }
  .bottom{
    color: aliceblue;
    border-bottom-right-radius: inherit ;
    border-bottom-left-radius: inherit ;
    padding: 10px;
  }
  .refresh{
    color: aliceblue;
    text-align: center;
    border-radius: 3px;
    aspect-ratio: 1;
    padding: 10px;
  }
  .refresh:hover{
    background-color: blue;
  }
</style>

<template>
    <section>
      <div class="d-flex justify-content-center" style="flex:1;">
        <div class="row content custom-color">
          <div class="col-1"/>
          <div class="col-10 title">
            <h3> {{ title }}</h3>
            
          </div>
          <div class="col-1 d-flex align-items-center justify-content-center"> 
            <div class="custom-color refresh" @click="reset">
              <Refresh/>
            </div>
          </div>
          
          <!-- progress bar for each step -->
          <div class="progress col-12" style="height: 5px; background-color: rgba(0, 0,0, 0);">
            <div class="progress-bar bg-success" role="progressbar" :style="{width: progress+'%'}"/>
          </div>

          <!-- showing options of classes available -->
          <div v-if="state=='chooseCategory'" class="col-12" style="border-width: 2px 0px 2px 0px; border-style: solid; border-color: #ffffff12; padding-top: 10px; padding-bottom: 10px;">
            <div class="row d-flex justify-content-center">
              <div v-for="category in buttonCategories" class="col-3" >
                <CategoryButton :title="category.title" @click="setCategory(category)" style="padding: 10px;"/>
              </div>
            </div>
          </div>

          <!-- showing options of classes available -->
          <div v-if="state=='answerQuestion'" class="col-12" style="border-width: 2px 0px 2px 0px; border-style: solid; border-color: #ffffff12; padding-top: 10px; padding-bottom: 10px;">
            <div style="color: rgba(255, 255, 255, 1); text-align: center; padding: 10px; margin-bottom: 10px;">
              Choose one reaction to indicate the satisfaction grade.
            </div>
            <div class="row d-flex justify-content-around" style="margin-bottom: 10px;">
              <GradeButton v-for="type in ['bad','neutral','good','veryGood']" :type="type" @click="setAnswer"/>
            </div>
          </div>

          <!-- showing thanks message -->
          <div v-if="state=='thanksMessage'" class="col-12" style="border-width: 2px 0px 2px 0px; border-style: solid; border-color: #ffffff12; padding-top: 10px; padding-bottom: 10px;">
            <div class="row d-flex justify-content-around" style="color: whitesmoke;">
              Thank you for your participation!
            </div>
          </div>

          <!-- always on the screen-->
          <div class="bottom">
            All informations are stored anonymously.
          </div>
        </div>

      </div>
      
    </section>
</template>

<script setup>

// configurations
const quantityOfQuestions = 2;
const waitSeconds = 5 ;
var answeredQuestions = 0;

// get list of sections
const {id} = useRoute().params
const buttonCategories = await useFetch('/api/categories?url='+id).data

// initial values
const title = ref('Loading') 
const progress = ref(0)
const state =  ref('chooseCategory')
state.value = 'thanksMessage';

// temporary store
var selectedCategory = null
var displayedQuestion = null

// manage the states 
const automata = {
  chooseCategory : {
    init : () => { title.value =  "Choose one option to continue:"; },
    next : () => { return 'answerQuestion' },
  },
  answerQuestion : {
    init : () => { getQuestion().then((x)=> title.value = x)},
    next : () => { 
      answeredQuestions += 1;
      if (answeredQuestions == quantityOfQuestions){
        answeredQuestions = 0 ;
        return 'thanksMessage';
      }
      return 'answerQuestion'
    },
  },
  thanksMessage : {
    init : () => { 
      title.value = 'Done!'; 
      delay(waitSeconds*1000).then( ()=>{updateState()})
    },
    next : () => { return 'chooseCategory'},
  },
};

updateState()

function getQuestion(){
  return useFetch('/api/question?url='+id).then((x) => {
    let data = toRaw(x.data._value);
    displayedQuestion  = data;
    return data.title;
  })
}

function updateState(){
  state.value = automata[state.value].next()
  automata[state.value].init()
  progress.value += 25
  if (state.value == 'chooseCategory' ){
    progress.value = 25
  }
}

function setCategory(category){
  selectedCategory = toRaw(category)
  updateState()
}

// final answer = data parameter
function setAnswer(data){
  const params = "url="+id+"&grade="+data+"&question="+displayedQuestion.id+"&section="+selectedCategory.id
  useFetch('/api/answer?'+params) //.then((req) => console.log(req))
  updateState()
}

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

function reset(){
  answeredQuestions = 0;
  state.value = 'chooseCategory';
  automata[state.value].init()
  progress.value = 25
}

</script>