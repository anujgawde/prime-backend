const Documents = require("../../models/documents/Documents");
const Templates = require("../../models/templates/Templates");

exports.getAllDocuments = async (req, res) => {
  const query = req.query;
  const allDocuments = await Documents.find({
    user: query.userId,
  }).sort({ modifiedAt: -1 });
  res.json(allDocuments);
};

exports.getRecentDocuments = async (req, res) => {
  const body = req.body;
  const recentDocuments = await Documents.find({ user: body.userId })
    .sort({ modifiedAt: -1 })
    .limit(10);
  res.json(recentDocuments);
};

exports.deleteDocument = async (req, res) => {
  const body = req.body;
  await Documents.findByIdAndDelete(body.documentId);
  const allDocuments = await Documents.find({ user: body.userId });
  res.json(allDocuments);
};

exports.getAggregateDocuments = async (req, res) => {
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
  let countsByMonth = monthNames.map((name, index) => ({
    month: name,
    count: 0,
  }));

  const abc = await Documents.aggregate([
    {
      $match: {
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

  // Update the countsByMonth array with the counts from the aggregation
  abc.forEach(({ _id, count }) => {
    countsByMonth[_id - 1].count = count; // _id - 1 because array is 0-indexed
  });

  res.json(countsByMonth);
};
