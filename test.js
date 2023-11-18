var cors = require('cors')
const axios = require('axios');
const http = require('http');
const path = require("path");
const express = require('express')
const { Server } = require("socket.io");
const app = express()
const mysql = require('mysql2/promise');
const {RtcTokenBuilder, RtcRole} = require('agora-access-token');
const dotenv = require('dotenv');
// app.use(express.static(path.join(__dirname, "flutter")));
app.use(express.json());
app.use(cors())
const port = 3000
const server = http.createServer(app);
const io = new Server(server);
var usersRouter = require('./routes/users');
var departmentsRouter = require('./routes/departments');
var symptomsRouter = require('./routes/symptoms');
var doctorsRouter = require('./routes/doctors');
var appointmentRouter = require('./routes/appointments');
var chatsRouter = require('./routes/chats');
var appointmentDocument = require('./routes/appointment_document');
var prescriptionsRouter = require('./routes/prescriptions');
var medicineRouter = require('./routes/medicines');
var workHistoryRouter = require('./routes/work_history');
var educationRouter = require('./routes/education_history');
var chamberRouter = require('./routes/chamber');
var calenderRouter = require('./routes/calender');
var districtRouter = require('./routes/districts');
var docorProfiletRouter = require('./routes/doctor_profile');
var docorSpecialistRouter = require('./routes/doctor_specialist');
var walletRouter = require('./routes/wallet');
var doctorSymptomsRouter = require('./routes/doctor_symptoms');
var adminChatRouter =  require('./routes/admin_chat');
var commissionsChatRouter =  require('./routes/commissions');
var commissionsReductionRouter =  require('./routes/appointment_reductions');
var cuponnRouter =  require('./routes/cupon_code');
var bannerRouter =  require('./routes/banners');
var adCardRouter =  require('./routes/advantage_card');
var customerCardRouter =  require('./routes/customer_advantage_card');
var withdrawalsRouter =  require('./routes/withdrawals');
var subscriptionsRouter =  require('./routes/user_subscriptions');
var diagTestRouter =  require('./routes/diag_tests');
var refersRouter =  require('./routes/refers');



APP_ID='b34a8c22759340a1bec04e864ec72daf'
APP_CERTIFICATE='26f3ca7ca7724c6cb93f952fbddfc6db'
const nocache = (_, resp, next) => {
  resp.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  resp.header('Expires', '-1');
  resp.header('Pragma', 'no-cache');
  next();
}
var deploy_v  = 0;
// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool({
	host: '127.0.0.1',
	user: 'root',
	database: 'exam',
	password:'password',
	waitForConnections: true,
	connectionLimit: 10,
	maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
	idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
	queueLimit: 0,
	enableKeepAlive: true,
	keepAliveInitialDelay: 0
  });
async function getConnection(){
	return pool;
 // return  await  mysql.createConnection({host: "127.0.0.1",user: "root",password: "password",database : 'exam'});
}

const generateRTCToken = (req, resp) => { 
  resp.header('Access-Control-Allow-Origin', '*');
  const channelName = req.params.channel;
  if (!channelName) {
    return resp.status(500).json({ 'error': 'channel is required' });
  }
  let uid = req.params.uid;
  if(!uid || uid === '') {
    return resp.status(500).json({ 'error': 'uid is required' });
  }
  // get role
  let role;
  if (req.params.role === 'publisher') {
    role = RtcRole.PUBLISHER;
  } else if (req.params.role === 'audience') {
    role = RtcRole.SUBSCRIBER
  } else {
    return resp.status(500).json({ 'error': 'role is incorrect' });
  }
  let expireTime = req.query.expiry;
  if (!expireTime || expireTime === '') {
    expireTime = 3600;
  } else {
    expireTime = parseInt(expireTime, 10);
  }
  const currentTime = Math.floor(Date.now() / 1000);
  const privilegeExpireTime = currentTime + expireTime;

  let token;
  if (req.params.tokentype === 'userAccount') {
    token = RtcTokenBuilder.buildTokenWithAccount(APP_ID, APP_CERTIFICATE, channelName, uid, role, privilegeExpireTime);
  } else if (req.params.tokentype === 'uid') {
    token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channelName, uid, role, privilegeExpireTime);
  } else {
    return resp.status(500).json({ 'error': 'token type is invalid' });
  }

  return resp.json({ 'rtcToken': token });

};
// app.get("/health/tele-sastho", (req, res) => {
// 	//res.send("ok");
// 	res.sendFile(path.join(__dirname, "flutter"));
// });
app.get('/health/rtc/:channel/:role/:tokentype/:uid', nocache , generateRTCToken)
app.use('/health/users', usersRouter);
app.use('/health/departments', departmentsRouter);
app.use('/health/symptoms', symptomsRouter);
app.use('/health/doctors', doctorsRouter);
app.use('/health/appointments', appointmentRouter);
app.use('/health/chats', chatsRouter);
app.use('/health/appointment-document', appointmentDocument);
app.use('/health/prescriptions', prescriptionsRouter);
app.use('/health/medicines', medicineRouter);
app.use('/health/work-history', workHistoryRouter);
app.use('/health/education-history', educationRouter);
app.use('/health/chamber', chamberRouter);
app.use('/health/calender', calenderRouter);
app.use('/health/district', districtRouter);
app.use('/health/doctor-profile', docorProfiletRouter);
app.use('/health/doctor-specialist', docorSpecialistRouter);
app.use('/health/wallet', walletRouter);
app.use('/health/doctor-symptoms', doctorSymptomsRouter);
app.use('/health/admin-chat', adminChatRouter);
app.use('/health/commissions', commissionsChatRouter);
app.use('/health/appointment-reductions', commissionsReductionRouter);
app.use('/health/coupon', cuponnRouter);
app.use('/health/banners', bannerRouter);
app.use('/health/advantage-card', adCardRouter);
app.use('/health/customer-advantage-card', customerCardRouter);
app.use('/health/withdrawals', withdrawalsRouter);
app.use('/health/subscriptions', subscriptionsRouter);
app.use('/health/diag-tests', diagTestRouter);
app.use('/health/refers', refersRouter);


app.get('/', (req, res) => {
  res.send('Welcome to Telesastho - 12-10-2023')
})
app.post('/health/prequest', (req, res) => {
axios.post(req.body["link"],req.body)
  .then(function (response) {
var r = response.data;
r["reqBody"] = req.body;
    res.send(r)
  })
  .catch(function (error) {
    // handle error

  })
  .finally(function () {
    // always executed
  });
  
})
app.post('/request', (req, res) => {
axios.get(req.body["link"])
  .then(function (response) {
    res.send(response.data)
  })
  .catch(function (error) {
    // handle error
  })
  .finally(function () {
    // always executed
  });
  
})

async function subjectsonclass(res,id){
	try{
		var query1 = 'Select * FROM Subjects where class_id='+id;
		var con = await getConnection();
		const [rows, fields] = await con.execute(query1);
		var query2 = 'Select * FROM Classes where id='+rows[0]["class_id"];
		const [rows2, fields2] = await con.execute(query2);
		rows[0]["class"] =  rows2[0];
		var query3 = 'Select * FROM Courses where subject_id='+rows[0]["id"];
		const [rows3, fields3] = await con.execute(query3);
		rows[0]["courses"] =  rows3;
		var query4 = 'Select * FROM Courses where class_id='+rows[0]["class_id"] ;
		const [rows4, fields4] = await con.execute(query4);
		rows[0]["courses_similar_class"] =  rows4;
		
		res.send(rows[0]);
	}catch(e){
		console.log(e);
		res.send("error ocured");

	}
}

async function subject(res,id){
	try{
		var query1 = 'Select * FROM Subjects where id='+id;
		var con = await getConnection();
		const [rows, fields] = await con.execute(query1);
		var query2 = 'Select id,name FROM Classes where id='+rows[0]["class_id"];
		const [rows2, fields2] = await con.execute(query2);
		rows[0]["class"] =  rows2[0];
		var query3 = 'Select id,name,description,price FROM Courses where subject_id='+rows[0]["id"];
		const [rows3, fields3] = await con.execute(query3);
		rows[0]["courses"] =  rows3;
		var query4 = 'Select id,name,description,price FROM Courses where class_id='+rows[0]["class_id"] ;
		const [rows4, fields4] = await con.execute(query4);
		rows[0]["courses_similar_class"] =  rows4;
		

		var query5 = 'Select Name,id FROM Subjects where class_id='+rows[0]["class_id"];
		const [rows5, fields5] = await con.execute(query5);
		rows[0]["all_subjects"] = rows5;


		res.send(rows[0]);
	}catch(e){
		console.log(e);
		res.send("error ocured");

	}
}
async function deletecourse(res,id){
	try{
		var query1 = 'DELETE  FROM Courses where id='+id;
		var con = await getConnection();
		const [rows, fields] = await con.execute(query1);
		
		res.send(rows);
	}catch(e){
		console.log(e);
		res.send("error ocured");

	}
}
async function deletequize(res,id){
	try{
		var query1 = 'DELETE  FROM Quizes where id='+id;
		var con = await getConnection();
		const [rows, fields] = await con.execute(query1);
		
		res.send(rows);
	}catch(e){
		console.log(e);
		res.send("error ocured");

	}
}
async function deletechapter(res,id){
	try{
		var query1 = 'DELETE  FROM Chapters where id='+id;
		var con = await getConnection();
		const [rows, fields] = await con.execute(query1);
		
		res.send(rows);
	}catch(e){
		console.log(e);
		res.send("error ocured");

	}
}
async function deletequestion(res,id){
	try{
		var query1 = 'DELETE  FROM Questions where id='+id;
		var con = await getConnection();
		const [rows, fields] = await con.execute(query1);
		var query2 = 'DELETE  FROM Options where question_id='+id;
		res.send(rows);
	}catch(e){
		console.log(e);
		res.send("error ocured");

	}
}
async function deletesubject(res,id){
	try{
		var query1 = 'DELETE  FROM Subjects where id='+id;
		var con = await getConnection();
		const [rows, fields] = await con.execute(query1);
		res.send(rows);
	}catch(e){
		console.log(e);
		res.send("error ocured");

	}
}
async function deleteclasses(res,id){
	try{
		var query1 = 'DELETE  FROM Classes where id='+id;
		var con = await getConnection();
		const [rows, fields] = await con.execute(query1);
		res.send(rows);
	}catch(e){
		console.log(e);
		res.send("error ocured");

	}
}

async function subjectsinclass(res,id){
	try{
		var query1 = 'SELECT * FROM Subjects  ORDER BY updated_at DESC;'
		var query1 = 'SELECT Subjects.id as sid,Subjects.Name as sName,Subjects.created_at, Classes.name FROM Subjects INNER JOIN Classes ON Classes.id=Subjects.class_id  where Subjects.class_id ='+id;

		var con = await getConnection();
		const [rows, fields] = await con.execute(query1);
		res.send(rows);
	}catch(e){
		console.log(e);
		res.send("error ocured");

	}
}
async function subjects(res){
	try{
		var query1 = 'SELECT * FROM Subjects  ORDER BY updated_at DESC;'
		var query1 = 'SELECT Subjects.id as sid,Subjects.Name as sName,Subjects.created_at, Classes.name FROM Subjects INNER JOIN Classes ON Classes.id=Subjects.class_id   ;';

		var con = await getConnection();
		const [rows, fields] = await con.execute(query1);
		res.send(rows);
	}catch(e){
		console.log(e);
		res.send("error ocured");

	}
}
async function classes(res){
	try{
		var query1 = 'SELECT * FROM Classes  ORDER BY updated_at DESC;'
		var con = await getConnection();
		const [rows, fields] = await con.execute(query1);
		res.send(rows);
	}catch(e){
		res.send("error ocured");

	}
}
async function students(res){
	try{
		var query1 = 'SELECT * FROM Students  ORDER BY updated_at DESC;'
		var con = await getConnection();
		const [rows, fields] = await con.execute(query1);
		res.send(rows);
	}catch(e){
		res.send("error ocured");

	}
}
async function teachers(res){
	try{
		var query1 = 'SELECT id,LastName, FirstName,Address,Email,Phone FROM Teachers  ORDER BY updated_at DESC;'
		var con = await getConnection();
		const [rows, fields] = await con.execute(query1);
		res.send(rows);
	}catch(e){
		res.send("error ocured");

	}
}
async function getstudentsidHandeler(res,body){
	try{
		var query1 = 'SELECT * FROM Students where created_by = "'+body+'" ORDER BY updated_at DESC;'
		var con = await getConnection();
		const [rows, fields] = await con.execute(query1);
		res.send(rows);
	}catch(e){
		res.send("error ocured");

	}

}

async function getcourseHandeler(res,uid){
	try{
		var query1 = 'SELECT * FROM Course_purchase where student_id = "'+uid+'" order by updated_at DESC;';
		//var query1 = 'SELECT * FROM Course_purchase;';
		
		var con = await getConnection();
		const [rows, fields] = await con.execute(query1);
		//console.log(rows);
		//res.send(rows);
		
		for(var i = 0 ; i < rows.length ; i++){
			var query2 = 'SELECT * FROM Courses where id = "'+rows[i]["course_id"]+'";'; 
			const [rows2, fields2] = await con.execute(query2);
			if(rows2.length>0){
				rows[i]["course_name"] = rows2[0]["name"];
				rows[i]["description"] = rows2[0]["description"];
				rows[i]["price"] = rows2[0]["price"];

				var query3 = 'SELECT * FROM Teachers where id = "'+rows2[0]["created_by"]+'";';  
				const [rows3, fields3] = await con.execute(query3);
				
				if(rows3.length>0){
					rows[i]["teacher"] = rows3[0];
				}
			}else{
				console.log("course not found for "+rows[i]["course_id"]);
			}
			
			
			
		}

		

		res.send(rows);
	}catch(e){
		console.log(e);
		res.send("error ocured");

	}

}
async function getstudentsHandeler(res,body){
	try{
		var query1 = 'SELECT * FROM Students ORDER BY updated_at DESC;'
		var con = await getConnection();
		const [rows, fields] = await con.execute(query1);
		res.send(rows);
	}catch(e){
		res.send("error ocured");

	}

}

async function chaptersonsubject(res,id){
	try{
		//var query1 = 'SELECT * FROM Subjects where created_by = "'+created_by+'";'
		var query1 = 'SELECT Subjects.id as sid,Subjects.Name as sName, Chapters.class_id,Chapters.Name as cname,Chapters.id as cId FROM Subjects INNER JOIN Chapters ON Chapters.subject_id=Subjects.id AND Chapters.subject_id='+id+'  Order by Chapters.updated_at DESC ;';
		var con = await getConnection();
		const [rows, fields] = await con.execute(query1);


		for(var  j = 0 ; j < rows.length ; j++){
			var query2 = 'SELECT name from Classes where id ="'+rows[j]["class_id"]+'";'; 
			const [rows2, fields] = await con.execute(query2);
			if(rows2.length>0) rows[j]["class_name"] = rows2[0]["name"];
		}

		res.send(rows);
	}catch(e){
		console.log(e);
		res.send(e);

	}

}
async function chapters(res){
	try{
		//var query1 = 'SELECT * FROM Subjects where created_by = "'+created_by+'";'
		var query1 = 'SELECT Subjects.id as sid,Subjects.Name as sName, Chapters.class_id,Chapters.Name as cname,Chapters.id as cId FROM Subjects INNER JOIN Chapters ON Chapters.subject_id=Subjects.id Order by Chapters.updated_at DESC ;';
		var con = await getConnection();
		const [rows, fields] = await con.execute(query1);


		for(var  j = 0 ; j < rows.length ; j++){
			var query2 = 'SELECT name from Classes where id ="'+rows[j]["class_id"]+'";'; 
			const [rows2, fields] = await con.execute(query2);
			if(rows2.length>0) rows[j]["class_name"] = rows2[0]["name"];
		}

		res.send(rows);
	}catch(e){
		console.log(e);
		res.send(e);

	}

}

async function getchapterbyteacherHandeler(res,created_by){
	try{
		//var query1 = 'SELECT * FROM Subjects where created_by = "'+created_by+'";'
		var query1 = 'SELECT Subjects.id as sid,Subjects.Name as sName,Subjects.created_at, Chapters.class_id,Chapters.Name as cname,Chapters.id as cId FROM Subjects INNER JOIN Chapters ON Chapters.subject_id=Subjects.id where Chapters.created_by ="'+created_by+'"  ;';
		var con = await getConnection();
		const [rows, fields] = await con.execute(query1);


		for(var  j = 0 ; j < rows.length ; j++){
			var query2 = 'SELECT name from Classes where id ="'+rows[j]["class_id"]+'";'; 
			const [rows2, fields] = await con.execute(query2);
			rows[j]["class_name"] = rows2[0]["name"];
		}

		res.send(rows);
	}catch(e){
		res.send(e);

	}

}

async function getsubjectsHandeler(res,created_by){
	try{
		//var query1 = 'SELECT * FROM Subjects where created_by = "'+created_by+'";'
		var query1 = 'SELECT Subjects.id as sid,Subjects.Name as sName,Subjects.created_at, Classes.name as cname,Classes.id as cId FROM Subjects INNER JOIN Classes ON Classes.id=Subjects.class_id where Subjects.created_by ="'+created_by+'"  ;';
		var con = await getConnection();
		const [rows, fields] = await con.execute(query1);
		res.send(rows);
	}catch(e){
		res.send(e);

	}

}

async function getclassesIdHandeler(res,created_by){
	try{
		var query1 = 'SELECT * FROM Classes where created_by="'+created_by+'";'
		var con = await getConnection();
		const [rows, fields] = await con.execute(query1);
		res.send(rows);
	}catch(e){
		res.send("error ocured");

	}

}

async function getclassesHandeler(res,body){
	try{
		var query1 = 'SELECT * FROM Classes  ORDER BY updated_at DESC;'
		var con = await getConnection();
		const [rows, fields] = await con.execute(query1);
		res.send(rows);
	}catch(e){
		res.send("error ocured");

	}

}

async function getbatchesidHandeler(res,body){
	try{
		var query1 = 'SELECT * FROM Courses where created_by = "'+body+'" ORDER BY updated_at DESC;'
		var con = await getConnection();
		const [rows, fields] = await con.execute(query1);

		for(var i = 0 ; i < rows.length ; i++){
			try{
				var query7 = 'SELECT COUNT(*) as lnum FROM Lectures where course_id ='+rows[i]["id"];  
				const [rows7, fields] = await con.execute(query7);
				rows[i]["lectures"] = rows7;
			}catch(e){
				rows[i]["lectures"] = '--'  ;
			}
		}


		res.send(rows);
	}catch(e){
		console.log(e);
		res.send("error ocured");

	}

}
async function getbatcheLecturesHandeler(res,course_id){
	var con = await getConnection();
	try{
		var query7 = 'SELECT * FROM Lectures where course_id = '+course_id;  
		const [rows7, fields] = await con.execute(query7);
		//rows[j]["lecturesCount"] = rows7;


		for(var p = 0 ; p < rows7.length ; p++){
			var query8 = 'SELECT * FROM Contents where lecture_id = '+rows7[p]["id"];  
			const [rows8, fields] = await con.execute(query8);
			rows7[p]["contents"] = rows8;

		}
		for(var p = 0 ; p < rows7.length ; p++){
			var query8 = 'SELECT * FROM Lecture_quizes where lecture_id = '+rows7[p]["id"];  
			const [rows8, fields] = await con.execute(query8);
			for(var q = 0 ; q < rows8.length ; q++){
				var query8 = 'SELECT * FROM Quizes where id = '+rows8[q]["quize_id"];  
				const [rows9, fields] = await con.execute(query8);
				rows8[q]["q_details"] = rows9[0];
			}
			rows7[p]["quize"] = rows8 ;

		}
		res.send(rows7);
		//rows[j]["lecture"] = rows7;
	}catch(e){
		console.log(e);
		res.send(e);
		//rows[j]["lecture"] = e ;
	}

}
async function getbatchesHandeler(res,body){
	try{
		var query1 = 'SELECT * FROM Courses ORDER BY updated_at DESC;'
		var con = await getConnection();
		const [rows, fields] = await con.execute(query1);
		for(var  j = 0 ; j < rows.length ; j++){

			try{
				var query7 = 'SELECT * FROM Lectures where course_id = '+rows[j]["id"];  
				const [rows7, fields] = await con.execute(query7);
				//rows[j]["lecturesCount"] = rows7;


				for(var p = 0 ; p < rows7.length ; p++){
					var query8 = 'SELECT Count(*) as content_count FROM Contents where lecture_id = '+rows7[p]["id"];  
					const [rows8, fields] = await con.execute(query8);
					rows7[j]["content_count"] = rows8[0]["content_count"] ;

				}
				for(var p = 0 ; p < rows7.length ; p++){
					var query8 = 'SELECT Count(*) as count FROM Lecture_quizes where lecture_id = '+rows7[p]["id"];  
					const [rows8, fields] = await con.execute(query8);
					rows7[j]["quize_count"] = rows8[0]["count"] ;

				}
				rows[j]["lecture"] = rows7;
			}catch(e){
				rows[j]["lecture"] = e ;
			}






			if(rows[j]["created_by"])try{
				var query3 = 'SELECT LastName,FirstName FROM Teachers where id = "'+rows[j]["created_by"]+'";';  
				const [rows3, fields3] = await con.execute(query3);
				rows[j]["teacher"] = rows3[0];
			}catch(e){}
			try{
				if(rows[j]["class_id"]){
					var query2 = 'SELECT name from Classes where id ='+rows[j]["class_id"]+';'; 
					const [rows2, fields] = await con.execute(query2);
					rows[j]["class_name"] = rows2[0]["name"];
				}else{
					rows[j]["class_name"] = "--";
				}
			}catch(e){

			}

			try{
				try{
					if(rows[j]["subject_id"]){

						var query4 = 'SELECT Name FROM Subjects where id="'+rows[j]["subject_id"]+'";' ; 
						  const [rows4, fields4] = await con.execute(query4);
						rows[j]["subject_name"] = rows4[0]["Name"];
						}else{
							rows[j]["subject_name"] = "--";
						}	
				}catch(e){
					rows[j]["subject_name"] = e;
				}
			
		
			}catch(e){

			}



			
		

		}
		res.send(rows);
	}catch(e){
		print(e);
		res.send(e);

	}

}

async function coursedetails(id,res){

	var con = await getConnection();
	var query1 = 'SELECT * FROM Courses where id = "'+id +'"';
  	const [rows, fields] = await con.execute(query1);

	var courseBody  = rows[0];



		try{
			var query7 = 'SELECT * FROM Lectures where course_id = '+courseBody["id"];  
			const [rows7, fields] = await con.execute(query7);
			//rows[j]["lecturesCount"] = rows7;


			for(var p = 0 ; p < rows7.length ; p++){
				var query8 = 'SELECT * FROM Contents where lecture_id = '+rows7[p]["id"];  
				const [rows8, fields] = await con.execute(query8);
				rows7[p]["contents"] = rows8 ;

			}
			for(var p = 0 ; p < rows7.length ; p++){
				var query8 = 'SELECT * FROM Lecture_quizes where lecture_id = '+rows7[p]["id"];  
				const [rows8, fields] = await con.execute(query8);

				


				rows7[p]["quizes"] = rows8 ;

			}
			
			courseBody["lecture"] = rows7;
		}catch(e){
			courseBody = e ;
		}






		if(courseBody["created_by"])try{
			var query3 = 'SELECT LastName,FirstName FROM Teachers where id = "'+courseBody["created_by"]+'";';  
			const [rows3, fields3] = await con.execute(query3);
			courseBody["teacher"] = rows3[0];
		}catch(e){}
		try{
			if(courseBody["class_id"]){
				var query2 = 'SELECT name from Classes where id ='+courseBody["class_id"]+';'; 
				const [rows2, fields] = await con.execute(query2);
				courseBody["class_name"] = rows2[0]["name"];
			}else{
				courseBody["class_name"] = "--";
			}
		}catch(e){

		}

		
			try{
				if(courseBody["subject_id"]){ 

					var query4 = 'SELECT Name FROM Subjects where id="'+courseBody["subject_id"]+'";' ; 
					  const [rows4, fields4] = await con.execute(query4);
					  courseBody["subject_name"] = rows4[0]["Name"];
					}else{
						courseBody["subject_name"] = "--";
					}	
			}catch(e){
				courseBody["subject_name"] = e;
			}
		
	
	



		
	


	res.send(courseBody);
	
  	

}
async function handleuser(id,res){

	var con = await getConnection();
	var query1 = 'SELECT * FROM Students where id = "'+id +'"';
  	const [rows, fields] = await con.execute(query1);
	var isStudent = false;
	var isTeacher = false;
	var userBody ;
	if(rows.length>0){
		isStudent = true ;
		userBody = rows[0];
		
	}else{
		var query2 = 'SELECT * FROM Teachers where id = "'+id +'"'; 
  	    const [rows, fields] = await con.execute(query2);
		if(rows.length>0){
			isTeacher = true;
			userBody = rows[0];
		}

	}
	res.send({"isStudent":isStudent,"isTeacher":isTeacher,"user":userBody});
  	

}
async function handlequiz(id,res){

	var con = await getConnection();
	var query1 = "SELECT * FROM Quizes where id = "+id ;
  	const [rows, fields] = await con.execute(query1);
  	res.send(rows[0]);

}

async function buycourseHandeler(res,body){
	try{
		var con = await getConnection();
	
	
			var query4 = 'INSERT INTO Course_purchase (course_id, student_id) VALUES ( ? , ?  );'
			let todo4 = [body["course_id"],body["student_id"]]; 
			const [rows, fields] = 	await con.query(query4,todo4);
	
		res.send({rows});
	}catch(e){
		res.send({"message":e});
	}
}

async function myquizeearnings(res,teacher_id){
	try{
		var con = await getConnection();
		
		var studentObject = [];
		var earning = 0;
		
			var query1 = 'SELECT * FROM Quize_purchase where teacher_id = "'+teacher_id+'";';
		    const [rows, fields] = await con.execute(query1);
			//res.send(rows);
			console.log(rows.length+" Course_purchase found");
			for(var i = 0 ; i < rows.length ; i++){
				earning = earning+rows[i]["price"];
				var query3 = 'SELECT * FROM Students where id = "'+rows[i]["student_id"]+'";';  
			    const [rows3, fields3] = await con.execute(query3);

				var query4 = 'SELECT * FROM Quizes where id = "'+rows[i]["quiz_id"]+'";';  
			    const [rows4, fields4] = await con.execute(query4);

				console.log(rows3.length+" student found");
				
					studentObject.push({"quiz":rows4[0],"paid":rows[i]["price"],"student_id":rows3[0]["id"],"student":rows3[0]["LastName"]+" "+rows3[0]["FirstName"]});
				
				}

		res.send({"total_earning":earning,"list":studentObject});


		

	//	res.send(rows);
	}catch(e){
		console.log(e);
		res.send(e);

	}
	
	
}
async function myEarnings(res,teacher_id){
	try{

		var query0 = 'SELECT * FROM Courses where created_by = "'+teacher_id+'";';
		var con = await getConnection();
		const [rows0, fields0] = await con.execute(query0);
		console.log(rows0.length+" courses found");
		var studentObject = [];
		var earning = 0;
		for(var j = 0 ; j < rows0.length ; j++){
			var query1 = 'SELECT * FROM Course_purchase where course_id = "'+rows0[j]["id"]+'";';
		    const [rows, fields] = await con.execute(query1);
			console.log(rows.length+" Course_purchase found");
			for(var i = 0 ; i < rows.length ; i++){
				earning = earning+rows0[j]["price"];
				var query3 = 'SELECT * FROM Students where id = "'+rows[i]["student_id"]+'";';  
			    const [rows3, fields3] = await con.execute(query3);
				console.log(rows3.length+" student found");
				for(var k = 0 ; k < rows3.length ; k++){
					studentObject.push({"course":rows0[j]["name"],"course_id":rows0[j]["id"],"paid":rows0[j]["price"],"student_id":rows3[k]["id"],"student":rows3[k]["LastName"]+" "+rows3[k]["FirstName"]});
				}
				}
}
		res.send({"total_earning":earning,"list":studentObject});


		

	//	res.send(rows);
	}catch(e){
		res.send(e);

	}
	
	
}
async function myQuizes(res,student_id){
	var quizes = [];

		try{
			var query1 = 'SELECT * FROM Course_purchase where student_id = "'+student_id+'";';
			var con = await getConnection();
			const [rows, fields] = await con.execute(query1);
	
			for(var i = 0 ; i < rows.length ; i++){
				var query2 = 'SELECT * FROM Courses where id = "'+rows[i]["course_id"]+'";'; 
				const [rows2, fields2] = await con.execute(query2);
				rows[i]["course_name"] = rows2[0]["name"];
				rows[i]["description"] = rows2[0]["description"];
				rows[i]["price"] = rows2[0]["price"];
				var query3 = 'SELECT * FROM Teachers where id = "'+rows2[0]["created_by"]+'";';  
				const [rows3, fields3] = await con.execute(query3);
				rows[i]["teacher"] = rows3[0];
				

				var query4 = 'SELECT * FROM Quizes where course_id = "'+rows[i]["course_id"]+'";'; 
				const [rows4, fields4] = await con.execute(query4);

				for(var q = 0 ; q< rows4.length ; q++){
					rows4[q]["course"] = rows2[0]["name"];
					rows4[q]["teacher"] = rows3[0]["FirstName"]+rows3[0]["LastName"];
					quizes.push(rows4[q]);
					
				}


			}
	
			
	
			res.send(quizes);
		}catch(e){
			res.send("error ocured");
	
		}

	
	
}
async function mystudents(res,teacher_id){
	try{

		var query0 = 'SELECT * FROM Courses where created_by = "'+teacher_id+'";';
		var con = await getConnection();
		const [rows0, fields0] = await con.execute(query0);
		console.log(rows0.length+" courses found");
		var studentObject = [];
		for(var j = 0 ; j < rows0.length ; j++){
			var query1 = 'SELECT * FROM Course_purchase where course_id = "'+rows0[j]["id"]+'";';
		    const [rows, fields] = await con.execute(query1);
			console.log(rows.length+" Course_purchase found");
			for(var i = 0 ; i < rows.length ; i++){
				var query3 = 'SELECT * FROM Students where id = "'+rows[i]["student_id"]+'";';  
			    const [rows3, fields3] = await con.execute(query3);
				console.log(rows3.length+" student found");
				for(var k = 0 ; k < rows3.length ; k++){
					studentObject.push({"course":rows0[j]["name"],"course_id":rows0[j]["id"],"student_id":rows3[k]["id"],"student":rows3[k]["LastName"]+" "+rows3[k]["FirstName"]});
				}
				}
}
		res.send(studentObject);


		

	//	res.send(rows);
	}catch(e){
		res.send(e);

	}
	
	
}
async function saveOptions(id,options,res){
	try{
		var con = await getConnection();
		for(var j = 0 ; j < options.length ; j++){ 
	
			var query4 = 'INSERT INTO Options (question_id, body) VALUES ( ? , ?  );'
			let todo4 = [id,options[j]];
			await con.query(query4,todo4);
		}
		res.send({"message":"saved successfully"});
	}catch(e){
		res.send({"message":e});
	}
}

async function getOptions(id,res){
	var con = await getConnection();
	var query3 = "SELECT * FROM Options where question_id = "+id ; 
  	const [rows3, fields3] = await con.execute(query3);
	res.send(rows3);
}
async function questionsidHandeler(res,created_by){

	var con = await getConnection();
	var allQuestions = [];
		var query2 = 'SELECT * FROM Questions where created_by="'+created_by+'" ORDER BY updated_at DESC' ; 
  	    const [rows2, fields2] = await con.execute(query2);


		for(var  j = 0 ; j < rows2.length ; j++){

			if(rows2[j]["class_id"]){
				var query3 = 'SELECT name FROM Classes where id="'+rows2[j]["class_id"]+'";' ; 
				const [rows3, fields3] = await con.execute(query3);
  
			    if(rows3.length>0)rows2[j]["class"] = rows3[0]["name"];
			}else{
				rows2[j]["class"] = "";
			}
			

			if(rows2[j]["subject_id"]){ 
				try{
					var query4 = 'SELECT Name FROM Subjects where id="'+rows2[j]["subject_id"]+'";' ; 
					const [rows4, fields4] = await con.execute(query4);
					if(rows4.length>0)rows2[j]["subject"] = rows4[0]["Name"];
				}catch(e){
					rows2[j]["subject"] = rows2[j]["subject_id"];
				}
				

			}else{
				rows2[j]["subject"] = rows2[j]["subject_id"];
			}

			if(rows2[j]["chapter_id"]){
				var query5 = 'SELECT Name FROM Chapters where id="'+rows2[j]["chapter_id"]+'";' ; 
				const [rows5, fields5] = await con.execute(query5);
  
				if(rows5.length>0)rows2[j]["chapter"] = rows5[0]["Name"];
			}else{
				rows2[j]["chapter"] = "";
			}
			

			
		}

		  

		   res.send(rows2);
	

}
async function questionsHandeler(res){

	var con = await getConnection();
	var allQuestions = [];
		var query2 = "SELECT * FROM Questions ORDER BY updated_at DESC" ; 
  	    const [rows2, fields2] = await con.execute(query2);
		   res.send(rows2);
		var allOptins = [];

		  for(var j = 0 ; j< rows2.length ; j++){

			var query3 = "SELECT * FROM Options where question_id = "+rows2[j]["id"] ; 
  	        const [rows3, fields3] = await con.execute(query3);
			allOptins.push(rows3);

			  



		  }
		  //rows2[i]["options"] = allOptins
		  allQuestions.push({"options":allOptins,"question":rows2[i]});







  	res.send(allQuestions);

}
async function handlequizQuestions(id,res){

	var con = await getConnection();
	var query1 = "SELECT * FROM Quizquestions where quizId = "+id ; 
  	const [rows, fields] = await con.execute(query1);
	var allQuestions = [];

	for(var i = 0 ; i< rows.length ; i++){
		var query2 = "SELECT * FROM Questions where id = "+rows[i]["questionId"] ; 
  	    const [rows2, fields2] = await con.execute(query2);

		  for(var j = 0 ; j< rows2.length ; j++){

			var query3 = "SELECT * FROM Options where question_id = "+rows2[j]["id"] ; 
			const [rows3, fields3] = await con.execute(query3);
			rows2[j]["options"] = rows3;
			//allOptins.push(rows3);
			allQuestions.push(rows2[j]);
		} 
	

		var allOptins = [];

		//   for(var j = 0 ; j< rows2.length ; j++){

		// 	var query3 = "SELECT * FROM Options where question_id = "+rows2[j]["id"] ; 
  	    //     const [rows3, fields3] = await con.execute(query3);
		// 	allOptins.push(rows3);

			  



		//   }
		  //rows2[i]["options"] = allOptins
		//  allQuestions.push({"options":allOptins,"question":rows2[i]});



	}



  	res.send(allQuestions);

}

async function updatequestion(res,body){
	try{
		var query1 = 'UPDATE  Questions SET title ="'+body["title"]+'", explanation = "'+body["explanation"]+'", q = "'+body["q"]+'" where id ='+body["id"];

		var con = await getConnection();
		const [rows, fields] = await con.execute(query1);
		res.send(rows);
	}catch(e){
		res.send("error ocured");

	}

}
async function saveschapterHandeler(res,body){
	try{
		var query1 = 'INSERT INTO Chapters (Name,created_by,class_id,subject_id) VALUES ( ? , ? , ? , ?);'
		let todo = [body["name"],body["created_by"],body["class_id"],body["subject_id"]
  ];
		var con = await getConnection();
		const [rows, fields] = await con.query(query1,todo);
		res.send(rows);
	}catch(e){
		res.send("error ocured");

	}

}
async function savesubjectsHandeler(res,body){
	try{
		var query1 = 'INSERT INTO Subjects (Name,created_by,class_id) VALUES ( ? , ? , ? );'
		let todo = [body["name"],body["created_by"],body["class_id"]
  ];
		var con = await getConnection();
		const [rows, fields] = await con.query(query1,todo);
		res.send(rows);
	}catch(e){
		res.send("error ocured");

	}

}
async function saveteacherHandeler(res,body){
	try{
		var query1 = 'INSERT INTO Teachers (id,LastName,FirstName,Address,Email,Phone) VALUES ( ? , ? , ? ,? ,? ,?);'
		let todo = [body["id"],body["LastName"],body["FirstName"],body["Address"],body["Email"],body["Phone"]
  ];
		var con = await getConnection();
		const [rows, fields] = await con.query(query1,todo);
		res.send(rows);
	}catch(e){
		res.send("error ocured");

	}

}
async function savestudentHandeler(res,body){
	try{
		var query1 = 'INSERT INTO Students (id,LastName,FirstName,Address,Email,Phone,batch_id,class_id,created_by) VALUES ( ? , ? , ? ,? ,? ,? ,? ,?,?);'
		let todo = [body["id"],body["LastName"],body["FirstName"],body["Address"],body["Email"],body["Phone"],body["batch_id"],body["class_id"],body["created_by"]
  ];
		var con = await getConnection();
		const [rows, fields] = await con.query(query1,todo);
		res.send(rows);
	}catch(e){
		res.send("error ocured");

	}
	
	
}
async function saveclassHandeler(res,body){
	try{
		var query1 = 'INSERT INTO Classes (name,created_by) VALUES ( ? , ? );'
		let todo = [body["name"],body["created_by"]
  ];
		var con = await getConnection();
		const [rows, fields] = await con.query(query1,todo);
		res.send(body);
	}catch(e){
		res.send("error ocured");

	}
	
	
}
async function savebatchHandeler(res,body){
	try{
		var query1 = 'INSERT INTO Courses (name,created_by,class_id,subject_id,description,price) VALUES ( ? , ? ,?,?,?,?);'
		let todo = [body["name"],body["created_by"],body["class_id"],body["subject_id"],body["description"],body["price"]
  ];
		var con = await getConnection();
		const [rows, fields] = await con.query(query1,todo);

		

		var lectures  = body["lectures"];
		for(var i = 0 ; i < lectures.length ; i++){
			var query2 = 'INSERT INTO Lectures (name,course_id,created_by) VALUES ( ? , ? ,?);'
			let todo2 = [lectures[i]["name"],rows["insertId"],body["created_by"]];
			const [rows2, fields] = await con.query(query2,todo2);
			var contents = lectures[i]["contents"];

			try{
				for(var j = 0 ; j < contents.length ; j++){
					var query3 = 'INSERT INTO Contents (title,data,lecture_id,created_by) VALUES ( ? , ? ,?,?);'
					let todo3 = [contents[j]["title"],contents[j]["body"],rows2["insertId"],body["created_by"]];
					const [rows3, fields3] = await con.query(query3,todo3);
					
		
				}
			}catch(e){
				console.log(e);

			}
			try{
				var quizes = lectures[i]["quizes"];
				for(var j = 0 ; j < quizes.length ; j++){
					var query3 = 'INSERT INTO Lecture_quizes (lecture_id,quize_id,course_id) VALUES ( ? , ? ,?);'
					let todo3 = [rows2["insertId"],quizes[j],rows["insertId"]];
					const [rows3, fields3] = await con.query(query3,todo3);
					
		
				}
			}catch(e){
				console.log(e);

			}

		}

		



		console.log("coursed saved");
		res.send(body);

		




	}catch(e){
		console.log(e);
		res.send("error ocured");

	}
	
	
}
async function mysubmittedQuizes(res,body){
	var con = await getConnection();
	try{
		var query2 = 'SELECT * FROM Quiz_submit where student_id ="'+body["student_id"]+'" order by updated_at DESC';
		const [rows2, fields] = await con.execute(query2);
		for(var i = 0 ; i <rows2.length ; i++ ){
			var query3 = 'SELECT title FROM Quizes where id ='+rows2[i]["quiz_id"];
			const [rows3, fields] = await con.execute(query3);
			rows2[i]["quize"] = rows3[0]["title"];
		}
	
		
		
		res.send(rows2);
	}catch(e){
		console.log(e);
		res.send({"e":"error on save","b":body,"error":e});
	}
}
async function quizsubmit(res,body){
	var con = await getConnection();
	try{
		var query2 = 'INSERT INTO Quiz_submit (unanswer, rightanswer, wrong, totalQues, marks,ansMap,quiz_id,student_id) VALUES ( ? , ? ,?, ? ,?,? ,?,?);'
		let todo2 = [body["unanswer"],body["rightanswer"],body["wrong"],body["totalQues"],body["marks"],body["ansMap"],body["quiz_id"],body["student_id"]];
		const [rows2, fields2] = await con.query(query2,todo2);
		
	
		
		console.log("quiz submitted");
		res.send("quiz submitted");
	}catch(e){
		console.log(e);
		res.send({"e":"error on save","b":body,"error":e});
	}
}
async function savequestionHandeler(res,body){
	var con = await getConnection();
	try{
		var query2 = 'INSERT INTO Questions (title, type, score, explanation, ans,q,subject_id,class_id,chapter_id,created_by) VALUES ( ? , ? ,?, ? ,?,? ,?,?,?,?);'
		let todo2 = [body["title"],body["type"],body["score"],body["explanation"],body["ans"],body["q"],body["subject_id"],body["class_id"],body["chapter_id"],body["created_by"]];
		const [rows2, fields2] = await con.query(query2,todo2);
		
	
		var options = body["options"];
		for(var j = 0 ; j < options.length ; j++){ 
	
			var query4 = 'INSERT INTO Options (question_id, body) VALUES ( ? , ?  );'
			let todo4 = [rows2["insertId"],options[j]];
			await con.query(query4,todo4);
	
	
	
		}
		res.send("quesuon save success");
	}catch(e){
		res.send({"e":"error on save","b":body,"error":e});
	}



	
	
}
async function mypurchasedquizes(res,student_id){
	var query1 = 'SELECT * FROM Quize_purchase  WHERE student_id ="'+student_id+'"  ORDER BY quiz_id DESC';
	
	var con = await getConnection();
	const [rows, fields5] = await con.execute(query1);
	for(var i = 0 ; i < rows.length ; i++){ 
		var query1 = 'SELECT title FROM Quizes  WHERE id ='+rows[i]["quiz_id"]+'';
		const [rows2, fields5] = await con.execute(query1);
		if(rows2.length>0)rows[i]["quize"] = rows2[0]["title"]; 
	}
	res.send(rows); 
}
async function savequizpurchaseHandeler(res,body){
	var query1 = 'INSERT INTO Quize_purchase (quiz_id, student_id,teacher_id, price) VALUES ( ? , ? ,?,?);'
	let todo = [body["quize_id"],body["student_id"],body["teacher_id"],body["price"]];
	var con = await getConnection();
	const [rows, fields] = await con.query(query1,todo);
	res.send(rows); 
}
async function savequizHandeler(res,body){

	
	try{
		var query1 = 'INSERT INTO Quizes (title, exam_start, exam_end, course_id, exam_time_minute, num_retakes,pass_mark,section_details,total_point,created_by,class_id,subject_id,chapter_id,price) VALUES ( ? , ? ,?, ? ,? ,?, ?, ?, ?,?,?,?,?,?);'
		let todo = [body["title"],body["exam_start"],body["exam_end"],body["course_id"],body["exam_time_minute"],body["num_retakes"],body["pass_mark"],body["section_details"],body["total_point"],body["created_by"],body["class_id"],body["subject_id"],body["chapter_id"],body["price"]
  ];
		var con = await getConnection();
		const [rows, fields] = await con.query(query1,todo);

		
		var questions = body["questions"];


		if(questions.length >0)for(var i = 0 ; i < questions.length ; i++){ 
			var query2 = 'INSERT INTO Questions (title, type, score, explanation, ans,q,class_id,subject_id,chapter_id,created_by) VALUES ( ? , ? ,?, ? ,?,? ,?,?,?,?);'
			let todo2 = [questions[i]["title"],questions[i]["type"],questions[i]["score"],questions[i]["explanation"],questions[i]["ans"],questions[i]["q"],body["class_id"],body["subject_id"],body["chapter_id"],body["created_by"]];
			const [rows2, fields2] = await con.query(query2,todo2);
			var query3 = 'INSERT INTO Quizquestions (quizId, questionId ) VALUES ( ? , ? );'
			let todo3 = [rows["insertId"],rows2["insertId"]];
			const [rows3, fields3] = await con.query(query3,todo3);

			var options = questions[i]["options"];
			for(var j = 0 ; j < options.length ; j++){ 

				var query4 = 'INSERT INTO Options (question_id, body) VALUES ( ? , ?  );'
			    let todo4 = [rows2["insertId"],options[j]];
				await con.query(query4,todo4);



			}

		




		}


		console.log("quize saves successfuly ");
		console.log(body);
		res.send({"status":true});
	}catch(e){
		console.log("error on saving quize");
		console.log(e);
		res.send({"status":"error on saving quize","error":e});
		

	}
	
	
}
async function quizesHandelerid(res,id){

	try{
		var query1 = 'SELECT * FROM Quizes  WHERE created_by ="'+id+'" order by updated_at DESC';
		//var q = 'SELECT Quizes.created_by, Quizes.exam_start,Quizes.exam_end,Quizes.exam_time_minute,Quizes.num_retakes,Quizes.pass_mark,Quizes.section_details,Quizes.total_point,Quizes.created_at,Quizes.updated_at,Quizes.id as quizid, batches.name as batchName, Quizes.title as quiztitle FROM batches INNER JOIN Quizes ON batches.id=Quizes.course_id ORDER BY Quizes.updated_at DESC WHERE Quizes.created_by ="'+id+'"';
		  var con = await getConnection();
		  const [rows2, fields] = await con.execute(query1);
		  
		 
		  for(var  j = 0 ; j < rows2.length ; j++){
			if(rows2[j]["class_id"]){
				var query3 = 'SELECT name FROM Classes where id="'+rows2[j]["class_id"]+'";' ; 
				const [rows3, fields3] = await con.execute(query3);
  
			    if(rows3.length>0) rows2[j]["class"] = rows3[0]["name"];
			}
			if(rows2[j]["subject_id"]){
				var query4 = 'SELECT Name FROM Subjects where id="'+rows2[j]["subject_id"]+'";' ; 
  	        const [rows4, fields4] = await con.execute(query4);

			  if(rows4.length>0)rows2[j]["subject"] = rows4[0]["Name"];
			}
			if(rows2[j]["chapter_id"]){
				var query5 = 'SELECT Name FROM Chapters where id="'+rows2[j]["chapter_id"]+'";' ; 
  	        const [rows5, fields5] = await con.execute(query5);

			  if(rows5.length>0)rows2[j]["chapter"] = rows5[0]["Name"];
			}
			if(rows2[j]["course_id"]){
				var query5 = 'SELECT name FROM Courses where id="'+rows2[j]["course_id"]+'";' ; 
  	        const [rows5, fields5] = await con.execute(query5);

			  if(rows5.length>0)rows2[j]["course"] = rows5[0]["name"];
			}
			

			

			
		}





		  res.send(rows2);
	}catch(e){
		print(e);
		res.send({"error":true,"msg":e});

	}

}
async function quizesHandeler(res){
	var query1 = "SELECT * FROM Quizes  ORDER BY updated_at DESC" ;
	//var q = "SELECT Quizes.exam_start,Quizes.exam_end,Quizes.exam_time_minute,Quizes.num_retakes,Quizes.pass_mark,Quizes.section_details,Quizes.total_point,Quizes.created_at,Quizes.updated_at,Quizes.id as quizid, Courses.name as batchName, Quizes.title as quiztitle FROM Courses INNER JOIN Quizes ON Courses.id=Quizes.course_id ORDER BY Quizes.updated_at DESC";
  	var con = await getConnection();
  	const [rows2, fields] = await con.execute(query1);
	  for(var  j = 0 ; j < rows2.length ; j++){
		if(rows2[j]["class_id"]){
			var query3 = 'SELECT name FROM Classes where id="'+rows2[j]["class_id"]+'";' ; 
			const [rows3, fields3] = await con.execute(query3);

		  rows2[j]["class"] = rows3[0]["name"];
		}
		if(rows2[j]["subject_id"]){
			var query4 = 'SELECT Name FROM Subjects where id="'+rows2[j]["subject_id"]+'";' ; 
		  const [rows4, fields4] = await con.execute(query4);

		rows2[j]["subject"] = rows4[0]["Name"];
		}
		if(rows2[j]["chapter_id"]){
			var query5 = 'SELECT Name FROM Chapters where id="'+rows2[j]["chapter_id"]+'";' ; 
		  const [rows5, fields5] = await con.execute(query5);

		rows2[j]["chapter"] = rows5[0]["Name"];
		}
		// if(rows2[j]["course_id"]){
		// 	var query5 = 'SELECT name FROM Courses where id="'+rows2[j]["course_id"]+'";' ; 
		//   const [rows5, fields5] = await con.execute(query5);

		// rows2[j]["course"] = rows5[0]["name"];
		// }
		

		

		
	}
  	res.send(rows2);
}
app.get('/subjectsonclass/:id', (req, res) => {
	var id = req.params["id"];
	subjectsonclass(res,id);
})
app.get('/subject/:id', (req, res) => {
	var id = req.params["id"];
	subject(res,id);
})
app.get('/deletecourse/:id', (req, res) => {
	var id = req.params["id"];
	deletecourse(res,id);
})
app.get('/deletequize/:id', (req, res) => {
	var id = req.params["id"];
	deletequize(res,id);
})
app.get('/deletechapter/:id', (req, res) => {
	var id = req.params["id"];
	deletechapter(res,id);
})

app.get('/deletequestion/:id', (req, res) => {
	var id = req.params["id"];
	deletequestion(res,id);
})

app.get('/deletesubject/:id', (req, res) => {
	var id = req.params["id"];
	deletesubject(res,id);
})

app.get('/deleteclass/:id', (req, res) => {
	var id = req.params["id"];
	deleteclasses(res,id);
})
app.get('/chaptersonsubject/:id', (req, res) => {
	var id = req.params["id"];
	chaptersonsubject(res,id);
})
app.get('/chapters', (req, res) => {
	chapters(res);
})
app.get('/subjectsinclass/:id', (req, res) => {
	var id = req.params["id"];
	subjectsinclass(res,id);
})
app.get('/subjects', (req, res) => {
	subjects(res);
})
app.get('/classes', (req, res) => {
	classes(res);
})
app.get('/students', (req, res) => {
	students(res);
})
app.get('/teachers', (req, res) => {
	teachers(res);
})

app.post('/mysubmittedQuizes', (req, res) => {
	mysubmittedQuizes(res,req.body);
})
app.post('/quiz-submit', (req, res) => {
	quizsubmit(res,req.body);
})
app.post('/savesquestion', (req, res) => {
	savequestionHandeler(res,req.body);
})
app.post('/updatequestion', (req, res) => {
	updatequestion(res,req.body);
})
app.post('/saveschapters', (req, res) => {
	saveschapterHandeler(res,req.body);
})
app.post('/savesubjects', (req, res) => {
	savesubjectsHandeler(res,req.body);
})
app.post('/saveteacher', (req, res) => {
	saveteacherHandeler(res,req.body);
})
app.post('/savestudent', (req, res) => {
	savestudentHandeler(res,req.body);
})
app.post('/saveclass', (req, res) => {
	saveclassHandeler(res,req.body);
})
app.post('/getsubjects', (req, res) => {
	var created_by = req.body["created_by"];
	getsubjectsHandeler(res,created_by);
})
app.post('/getchaptersbyteacher', (req, res) => {
	var created_by = req.body["created_by"];
	getchapterbyteacherHandeler(res,created_by);
})
app.get('/getclasses', (req, res) => {
	getclassesHandeler(res,req.body);
})
app.post('/getclasses', (req, res) => {
	var created_by = req.body["created_by"];
	getclassesIdHandeler(res,created_by);
})
app.post('/getstudents', (req, res) => {
	var created_by = req.body["created_by"];
	getstudentsidHandeler(res,created_by);
})
app.get('/getstudents', (req, res) => {
	getstudentsHandeler(res,req.body);
})
app.post('/savebatch', (req, res) => {
	savebatchHandeler(res,req.body);
})

app.get('/lectures/:id', (req, res) => {
	var id = req.params["id"];
	getbatcheLecturesHandeler(res,id);
})
app.get('/batches', (req, res) => {
	getbatchesHandeler(res,req.body);
})
app.get('/batches', (req, res) => {
	getbatchesHandeler(res,req.body);
})
app.post('/buycourse', (req, res) => {
	buycourseHandeler(res,req.body);
})
app.post('/getcourse', (req, res) => {
	getcourseHandeler(res,req.body["uid"]);
})
app.post('/batches', (req, res) => {
	var created_by = req.body["created_by"];
	getbatchesidHandeler(res,created_by);
})

app.post('/mypurchasedquizes', (req, res) => {
	mypurchasedquizes(res,req.body["uid"]); 
  })
app.post('/savequizpurchase', (req, res) => {
	savequizpurchaseHandeler(res,req.body);
  })
app.post('/savequiz', (req, res) => {
  savequizHandeler(res,req.body);
})
app.get('/savequiz', (req, res) => {
  res.send("savequiz");
})
app.get('/quizes', (req, res) => {
	quizesHandeler(res);
})
app.post('/quizes', (req, res) => {
	quizesHandelerid(res,req.body["uid"]);
})
app.get('/questions', (req, res) => {
	questionsHandeler(res);
})
app.post('/questions', (req, res) => {
	var created_by = req.body["created_by"];
	questionsidHandeler(res,created_by);
})

app.get('/course-details/:id', (req, res) => {
	var id = req.params["id"];
	coursedetails(id,res);
	
})
app.get('/user/:id', (req, res) => {
	var uid = req.params["id"];
	handleuser(uid,res);
	
})
app.get('/quize/:id', (req, res) => {
	var quizid = req.params["id"];
	handlequiz(quizid,res);
	
})
app.post('/options', (req, res) => {
	var id = req.body["id"];
	var list = req.body["options"];
	saveOptions(id,list,res);
	
})

app.get('/myquizes/:id', (req, res) => {
	var id = req.params["id"];
	myQuizes(res,id);
	
})
app.get('/myearnings/:id', (req, res) => {
	var id = req.params["id"];
	myEarnings(res,id);
	
})
app.get('/myquizeearnings/:id', (req, res) => {
	var id = req.params["id"];
	myquizeearnings(res,id);
	
})
app.get('/mystudents/:id', (req, res) => {
	var id = req.params["id"];
	mystudents(res,id);
	
})
app.get('/options/:id', (req, res) => {
	var id = req.params["id"];
	getOptions(id,res);
	
})
app.get('/quizequestions/:id', (req, res) => {
	var quizid = req.params["id"];
	handlequizQuestions(quizid,res);
	
})
app.post('/quizecheck', (req, res) => {
	res.send(req.body);
})
app.get('/version', (req, res) => {
	
  	res.send(deploy_v);
})

io.use((socket, next) => {
	if (socket.handshake.query) {
		let callerId = socket.handshake.query.callerId;
		socket.user = callerId;
		next();
	}
});
io.on('connection', (socket) => {

	console.log(socket.user, "Connected 2");
	socket.join(socket.user);


	socket.on('call', (msg) => {
		console.log('call');
		console.log(msg);
		io.emit(msg["uid"].toString(), msg);
	});
	socket.on('s_e_r_i_a_l', (msg) => {
		//console.log('appointment  ');
		//console.log(msg);
		io.emit(msg["appointment"].toString(), msg);
	});
	socket.on('appointment', (msg) => {
		console.log('appointment  ');
		console.log(msg);
		io.emit(msg["dr_id"].toString(), msg);
	});
	socket.on('prescription', (msg) => {
		console.log("prescription socket edited");
		console.log(msg);

		io.emit(msg["patient_id"].toString(), msg);
	});
	socket.on('chat', (msg) => {
		console.log('chat message');
		console.log(msg);
		io.emit(msg["appointment"].toString(), msg);
	});

	socket.on('chat_admin', (msg) => {
		console.log('chat_admin message');
		console.log(msg);
		io.emit("admin_chat_"+msg["receiver"].toString(), msg);
		io.emit("admin_chat_"+msg["sender"].toString(), msg);
	});

	socket.on('online', (msg) => {
		//console.log('online  for '+msg["id"].toString()+" status "+msg["status"]);

		io.emit("online_"+msg["id"].toString(), msg["status"]);

	});
});


server.listen(port, () => {
	console.log('listening on *:3000');
});
// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })
