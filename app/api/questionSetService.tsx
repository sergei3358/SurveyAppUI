
const url = "http://localhost:9000";


export async function getQuestionSets() {
  const getUrl = url + "/question_set";
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

export async function getQuestionSet(id: any) {
  const getUrl = url + "/question_set/" + id;
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


export async function createQuestionSet(questionSet : any) {
  const postUrl = url + "/question_set";
  const res = await fetch(postUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(questionSet)
  });

  let data = "";
  if (res.status == 200) data = await res.json();
  return data;

}


export async function createQuestionForQuestionSet(questionSet : any, id : any) {
  const postUrl = url + "/question_set/" + id;
  const res = await fetch(postUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(questionSet)
  });

  let data = "";
  if (res.status == 200) data = await res.json();
  return data;

}

export async function updateQuestionForQuestionSet(questionSet : any, id : any) {
  const postUrl = url + "/updateQuestion_set/" + id;
  const res = await fetch(postUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(questionSet)
  });

  let data = "";
  if (res.status == 200) data = await res.json();
  return data;

}


export async function updateQuestionSet(questionSet : any, id : any) {
  const postUrl = url + "/question_set/" + id;
  const res = await fetch(postUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(questionSet)
  });

  let data = "";
  if (res.status == 200) data = await res.json();
  return data;

}