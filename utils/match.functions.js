const {compareScores} = require('../utils/matchUser')
const {PrismaClient} = require('@prisma/client')

const prisma = new PrismaClient();

exports.finalCompare = async(allData,studentToCompare)=>{
    try {
        let myEmails = [];
        const selected = compareScores(allData,studentToCompare);
        myEmails.push(studentToCompare.email)
        let maxKey = Object.entries(selected).reduce((max, entry) => {
          if (entry[1] > max[1]) {
              return entry;
          } else {
              return max;
          }
      }, [-1, -Infinity])[0];
      /* Query User to get email */
      const matchedUser = await prisma.user.findFirst({
        where : {
           id : parseInt(maxKey)
        }
      })
     
      if(selected[maxKey] <= 0){
        return []
      }
      
      myEmails.push(matchedUser.email)
      return myEmails;

    } catch (error) {
      console.log('error FinalComapare', error)
      return [];
    }

}