const url = "http://localhost:9000";

export async function getIndividualCustomer() {
  const getUrl = url + "/survey_management";
  const res = await fetch(getUrl, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
 
  let data = [];
  if (res.status == 200) data = await res.json();
  return data;
 
}

export async function getSurveys() {
  const getUrl = url + "/surveys";
  const res = await fetch(getUrl, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });

  let data = [];
  if (res.status == 200) data = await res.json();
  return data;

}

export async function getSurveyQuestionSetBySurveyId(id: any) {
  const getUrl = url + "/surveys/questionSet/" + id;
  const res = await fetch(getUrl, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });

  let data = [];
  if (res.status == 200) data = await res.json();
  return data;

}


export async function getSurveyMeasurementBySurveyId(id: any) {
  const getUrl = url + "/surveys/measurement/"  + id;
  const res = await fetch(getUrl, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });

  let data = [];
  if (res.status == 200) data = await res.json();
  return data;

}

export async function getSurvey(id: any) {
  const getUrl = url + "/surveys/" + id;
  const res = await fetch(getUrl, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });

  let data = [];
  if (res.status == 200) data = await res.json();
  return data;

}


export async function createSurvey(survey : any) {
    const postUrl = url + "/surveys";
    const res = await fetch(postUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(survey)
    });
  
    let data = "";
    if (res.status == 200) data = await res.json();
    return data;
  
  }

  export async function addQuestionSetForSurvey(survey : any, id: any) {
    const postUrl = url + "/surveys/" + id;
    const res = await fetch(postUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(survey)
    });
  
    let data = "";
    if (res.status == 200) data = await res.json();
    return data;
  
  } 
  
  export async function updateQuestionSetForSurvey(survey : any, id: any) {
    const postUrl = url + "/updateQS/" + id;
    const res = await fetch(postUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(survey)
    });
  
    let data = "";
    if (res.status == 200) data = await res.json();
    return data;
  
  }  


  export async function deleteQuestionSetForSurvey(id: any, questionSetID: any) {
    const postUrl = url + "/surveys/questionSetDelete?surveyID=" + id + "&questionSetID=" + questionSetID;
    const res = await fetch(postUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });  
    let data = "";
    if (res.status == 200) data = await res.json();
    return data;
  
  } 


  export async function updateSurvey(survey : any, id: any) {
    const postUrl = url + "/updateSurvey/" + id;
    const res = await fetch(postUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(survey)
    });
  
    let data = "";
    if (res.status == 200) data = await res.json();
    return data;
  
  }
  
  export async function scheduleMeasurementsSurvey(requestBody : any) {
    const postUrl = url + "/schedule-measurements";
    const res = await fetch(postUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(requestBody)
    });
  
    let data = "";
    if (res.status == 200) data = await res.json();
    return data;
  
  }