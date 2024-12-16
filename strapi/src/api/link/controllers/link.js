'use strict';

/**
 * link controller
 */

const { createCoreController } = require('@strapi/strapi').factories;


// to refactorate: create services and use services, instead of duplicate the code..
module.exports = createCoreController('api::link.link', ({strapi}) => ({

  // get question to ask using the 'link.url' parameter
  async askQuestion(ctx){
    try {

      const {url} = ctx.params ;

      // get link_id by url and searching for the quiz connected to this link
      const link = await strapi.entityService.findMany('api::link.link',{
        fields: ['id'],
        filters: {
          url : url
        },
        populate : {
          quiz : {
            fields : ['id']
          }
        }
      })

      const linkID =  link[0].id ;
      const quizID = link[0].quiz.id ;

      // collecting all questions of this quiz
      const questions = await strapi.entityService.findMany('api::question.question',{
        filters : { 
          quiz : {
            id : quizID
          }
        },
        sort : {
          createdAt : 'desc'
        }
      })

      // creation time of last question
      const lastTime = questions[0].createdAt ;

      // counting all the answers of each question (belongs to this link)
      const count = await Promise.all( questions.map( async (question) => ({
        id : question.id,
        question : question,
        count : await strapi.entityService.count('api::answer.answer',{
          filters: {
            question : question.id,
            link : linkID ,
            createdAt : {
              $gte : lastTime
            }
          }
        })
      })))

      // TOURNAMENT ALGORITHM: to select one question
      let tournament = count
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
        .slice(0,3)
        .sort((a,b) => a.count - b.count )

      // tournament winner
      ctx.body = tournament[0].question;

    } catch(err) {
      ctx.body = err;
    }
  },

  // get all availables sections using the 'link.url' parameter
  async sections(ctx){
    try {

      const {url} = ctx.params ;

      // get link_id by url and searching for the quiz connected to this link
      const link = await strapi.entityService.findMany('api::link.link',{
        fields: ['id'],
        filters: {
          url : url
        },
        populate : {
          quiz : {
            fields : ['id']
          }
        }
      })

      // get sections connected to quiz
      const sections = await strapi.entityService.findMany('api::section.section',{
        fields : ['id','title'],
        filters:{
          quiz : link[0].quiz.id
        }
      })

      // return the list of sections
      ctx.body = sections ;

    } catch (err) {
      ctx.body = err ;
    }
  },

  // answer a question using the link.url parameter (and perform logic validations)
  async answer(ctx){

    try{

      const {url} = ctx.params ;
      const {question, grade, section} = ctx.request.body;

      // get link_id by url and searching for the quiz connected to this link
      const link = await strapi.entityService.findMany('api::link.link',{
        fields: ['id'],
        filters: {
          url : url
        },
        populate : {
          quiz : {
            fields : ['id']
          }
        }
      })

      // get sections connected to quiz
      const section_obj = await strapi.entityService.findMany('api::section.section',{
        fields : ['id'],
        filters:{
          id : section,
          quiz : link[0].quiz.id
        }
      })

      // collecting all questions of this quiz
      const question_obj = await strapi.entityService.findMany('api::question.question',{
        fields : ['id'],
        filters : { 
          id : question,
          quiz : {
            id : link[0].quiz.id
          }
        },
        sort : {
          createdAt : 'desc'
        }
      })

      // saving value
      const entry = await strapi.entityService.create('api::answer.answer', {
        data: {
          question: question_obj[0].id,
          link: link[0].id,
          section: section_obj[0].id,
          grade: grade,
        },
      });

      ctx.body = entry;
     
    }catch (err){
      ctx.body = err ;
    }

  }
}));
