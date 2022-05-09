// router.put("/:id/like", async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);
//     if (!post.likes.includes(req.body.userId)) {
//       await Post.updateOne({ $push: { likes: req.body.userId } });
//       res.status(200).json("post has been liked");
//     } else {
//       await Post.updateOne({ $pull: { likes: req.body.userId } });
//       res.status(200).json("post has been disliked");
//     }
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });
