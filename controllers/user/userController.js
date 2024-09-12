const Documents = require("../../models/documents/Documents");
const Templates = require("../../models/templates/Templates");
const Users = require("../../models/users/Users");

exports.fetchUserDetails = async (req, res) => {
  const user = await Users.findById(req.params.id);
  res.json(user);
};

exports.fetchUserDocsAggregate = async (req, res) => {
  const body = req.body;

  // Aggregate documents month-wise
  const currentYear = new Date().getFullYear();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Initial counts for each month set to 0
  let countByMonth = monthNames.map((name, index) => {
    return {
      month: name,
      documentCount: 0,
      templateCount: 0,
    };
  });

  const documentAggregate = await Documents.aggregate([
    {
      $match: {
        user: body.userId,
        createAt: {
          $gte: new Date(`${currentYear}-01-01`),
          $lt: new Date(`${currentYear + 1}-01-01`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$createAt" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  const templateAggregate = await Templates.aggregate([
    {
      $match: {
        user: body.userId,
        createAt: {
          $gte: new Date(`${currentYear}-01-01`),
          $lt: new Date(`${currentYear + 1}-01-01`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$createAt" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  // Update the documentCountByMonth array with the counts from the aggregation
  documentAggregate.forEach(({ _id, count }) => {
    countByMonth[_id - 1].documentCount = count; // _id - 1 because array is 0-indexed
  });

  templateAggregate.forEach(({ _id, count }) => {
    countByMonth[_id - 1].templateCount = count; // _id - 1 because array is 0-indexed
  });

  res.json(countByMonth);
};
