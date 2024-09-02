const Documents = require("../../models/documents/Documents");
const Templates = require("../../models/templates/Templates");

exports.getAllTemplates = async (req, res) => {
  const query = req.query;
  const templates = await Templates.find({ user: query.userId }).sort({
    modifiedAt: -1,
  });
  res.json(templates);
};

exports.deleteTemplate = async (req, res) => {
  const body = req.body;
  await Templates.findByIdAndDelete(body.templateId);
  const allTemplates = await Templates.find({ user: body.userId });
  res.json(allTemplates);
};

exports.getTopTemplates = async (req, res) => {
  const body = req.body;
  const topTemplates = await Documents.aggregate([
    {
      $match: { user: body.userId }, // Filter by userId
    },
    {
      $group: {
        _id: "$templateId", // Group by templateId
        count: { $sum: 1 }, // Count the number of documents per template
      },
    },
    {
      $sort: { count: -1 }, // Sort by count in descending order
    },
    {
      $limit: 3, // Limit to the top 3 templates
    },
  ]);
  // Extract the templateIds from the aggregation result
  const templateIds = topTemplates.map((template) => template._id);

  // Fetch the template details using the templateIds
  const mostUsedTemplates = await Templates.find({ _id: { $in: templateIds } });

  res.json(mostUsedTemplates);
};
