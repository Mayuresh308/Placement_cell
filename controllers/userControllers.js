const User = require('../models/userSchema');
const Student = require('../models/studentSchema');
const fs = require('fs');
const fastcsv = require('fast-csv');

// render sign up page
module.exports.signup = function (req, res) {
	if (req.isAuthenticated()) {
		return res.redirect('back');
	}
	res.render('signup');
};

// render sign in page
module.exports.signin = function (req, res) {
	if (req.isAuthenticated()) {
		return res.redirect('back');
	}
	res.render('signin');
};

// create session
module.exports.createSession = function (req, res) {
	console.log('Session created successfully');
	return res.redirect('/');
};

// signout
module.exports.signout = function (req, res) {
	req.logout(); // Just use req.logout(), no need for the callback
	return res.redirect('/users/signin');
};

// create user
module.exports.createUser = async function (req, res) {
	const { name, email, password, confirmPassword } = req.body;
	try {
		if (password !== confirmPassword) {
			console.log(`Passwords don't match`);
			return res.redirect('back');
		}
		const user = await User.findOne({ email });

		if (user) {
			console.log(`Email already exists`);
			return res.redirect('back');
		}

		const newUser = new User({
			name,
			email,
			password,
		});

		await newUser.save();

		if (!newUser) {
			console.log(`Error in creating user`);
			return res.redirect('back');
		}

		return res.redirect('/users/signin');
	} catch (error) {
		console.log(`Error in creating user: ${error}`);
		res.redirect('back');
	}
};

// download report
module.exports.downloadCsv = async function (req, res) {
	try {
		const students = await Student.find({});

		let data = '';
		let no = 1;
		let csv = 'S.No, Name, Email, College, Placemnt, Contact Number, Batch, DSA Score, WebDev Score, React Score, Interview, Date, Result';

		for (let student of students) {
			data =
				no +
				',' +
				student.name +
				',' +
				student.email +
				',' +
				student.college +
				',' +
				student.placement +
				',' +
				student.contactNumber +
				',' +
				student.batch +
				',' +
				student.dsa +
				',' +
				student.webd +
				',' +
				student.react;

			if (student.interviews.length > 0) {
				for (let interview of student.interviews) {
					data += ',' + interview.company + ',' + interview.date.toString() + ',' + interview.result;
				}
			}
			no++;
			csv += '\n' + data;
		}

		const dataFile = fs.writeFileSync('csv/data.csv', csv); // Use fs.writeFileSync instead of fs.writeFile
		console.log('Report generated successfully');
		return res.download('csv/data.csv');
	} catch (error) {
		console.log(`Error in downloading file: ${error}`);
		return res.redirect('back');
	}
};
