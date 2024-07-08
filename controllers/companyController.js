const Student = require('../models/studentSchema');
const Company = require('../models/companySchema');

// render company page
exports.companyPage = async (req, res) => {
  try {
    const students = await Student.find({});
    return res.render('company', { students });
  } catch (error) {
    console.log(`Error in rendering page: ${error}`);
    return res.redirect('back');
  }
};

// allocate interview
module.exports.allocateInterview = async (req, res) => {
  try {
    const students = await Student.find({});
    return res.render('allocateInterview', { students });
  } catch (error) {
    console.log(`Error in allocating interview: ${error}`);
    return res.redirect('back');
  }
};

// schedule interview
exports.scheduleInterview = async (req, res) => {
  const { id, company, date } = req.body;
  try {
    const existingCompany = await Company.findOne({ name: company });
    const obj = {
      student: id,
      date,
      result: 'Pending',
    };
    // if company doesn't exist
    if (!existingCompany) {
      const newCompany = await Company.create({
        name: company,
      });
      newCompany.students.push(obj);
      await newCompany.save();
    } else {
      let studentAlreadyScheduled = false;
      for (let student of existingCompany.students) {
        // if student id already exists
        if (student.student.toString() === id) {
          studentAlreadyScheduled = true;
          console.log('Interview with this student already scheduled');
          break;
        }
      }
      if (!studentAlreadyScheduled) {
        existingCompany.students.push(obj);
        await existingCompany.save();
      }
    }

    const student = await Student.findById(id);

    if (student) {
      const interview = {
        company,
        date,
        result: 'Pending',
      };
      student.interviews.push(interview);
      await student.save();
    }
    console.log('Interview Scheduled Successfully');
    return res.redirect('/company/home');
  } catch (error) {
    console.log(`Error in scheduling Interview: ${error}`);
    return res.redirect('back');
  }
};

// update status of interview
exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { companyName, companyResult } = req.body;
  try {
    const student = await Student.findById(id);
    if (student && student.interviews.length > 0) {
      for (let company of student.interviews) {
        if (company.company === companyName) {
          company.result = companyResult;
          await student.save();
          break;
        }
      }
    }
    const company = await Company.findOne({ name: companyName });

    if (company) {
      for (let std of company.students) {
        // compare student id and id passed in params
        if (std.student.toString() === id) {
          std.result = companyResult;
          await company.save();
        }
      }
    }
    console.log('Interview Status Changed Successfully');
    return res.redirect('back');
  } catch (error) {
    console.log(`Error in updating status: ${error}`);
    res.redirect('back');
  }
};

// Delete user data
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    // Find the student by ID and remove it from the database
    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      console.log('Student not found.');
      return res.redirect('back');
    }

    // Remove the student from the related companies
    for (const interview of deletedStudent.interviews) {
      const company = await Company.findOne({ name: interview.company });

      if (company) {
        company.students = company.students.filter((std) =>
          std.student.toString() !== id
        );
        await company.save();
      }
    }

    console.log('Student Deleted Successfully');
    return res.redirect('back');
  } catch (error) {
    console.log(`Error in deleting student: ${error}`);
    return res.redirect('back');
  }
};
