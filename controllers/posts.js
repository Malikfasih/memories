import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

// Query -> /posts?page=1 -> page = 1 // usually we use Query when have to query some data like 'search'
// params -> /posts/123 -> id = 123 // usually we use params when we want a specific resource like posts/id(of the posts)

export const getPosts = async (req, res) => {
  const { page } = req.query;
  try {
    const LIMIT = 8; // no of posts per page

    // get starting index of the every page
    const startIndex = (Number(page) - 1) * LIMIT; // start-index of the post from the specific page, converted again to Number as it was at frontend, coz it passed through req.query as string.

    const total = await PostMessage.countDocuments(); // we have to count up all the docs so we know how many page we have, and what is the last page we have to scroll to.
    const posts = await PostMessage.find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex); // we will find the newiest to oldest posts, we sort them by an id by passing obj with id(_id: -1) this will give us the newiest posts first. Then we limit them(per page), used skip() to skip all the previous pages e.g if we are on the page-2 we don't want to fetch all the 16 posts again, we just just skip the first page.

    res.status(200).json({
      data: posts,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
    }); // we have to pass bit more data to the frontend than simply posts to make the sense on the frontend, so we will pass the new obj with data = posts, the current page and the total no of pages.
  } catch {
    (error) => {
      res.status(404).json({ message: error.message });
    };
  }
};

export const getPost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await PostMessage.findById(id);

    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPostsBySearch = async (req, res) => {
  // we retreive the data from req.query
  const { searchQuery, tags } = req.query;

  try {
    // converting our title into regular expressions
    const title = new RegExp(searchQuery, "i"); // 'i' flag is used to ignore like if we search for (test/TEST/Test) it will make all equal sense to key words.
    //we converted to regExp that will be easy for mongoose and mongoDb to search the database

    const posts = await PostMessage.find({
      $or: [{ title }, { tags: { $in: tags.split(",") } }],
    }); // '$or' means either find me the 'title' or 'tags' that we typed on the frontend. As we opened another obj in tags coz its an array, used '$in' which says is there any tag that matches our query?.

    // once we have the post, send it back to frontend
    res.json({ data: posts });
  } catch (error) {
    // and if we have error we will send to frontend
    res.status(404).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const post = req.body;

  const newPostMessage = new PostMessage({
    ...post,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });

  try {
    await newPostMessage.save();
    res.status(201).json(newPostMessage);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

// once we make a request it will make to posts then to id like: /posts/123
// as using destructuring obj we can also rename the properties of the obj.

export const updatePost = async (req, res) => {
  const { id: _id } = req.params;
  const post = req.body; // that would we send from the frontend

  // to check is the mongoos obj contains that id
  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No post with that id");

  const updatedPost = await PostMessage.findByIdAndUpdate(
    _id,
    { ...post, _id },
    {
      new: true,
    }
  ); //{new: true} this means we recieve the new version of the post.
  // as this is an async action we added await infront of it.

  res.json(updatedPost);
}; // now we will go in the client side for the same logic

export const deletePost = async (req, res) => {
  const { id: _id } = req.params; // {id} or defining it like {id: _id} both works

  // to check the id is valid
  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No post with that id");

  // implementing the logic to delete the post
  await PostMessage.findByIdAndRemove(_id);
  res.json({ message: "Post deleted successfully" });
}; // now going to the frontend(client) to initiate it

export const likePost = async (req, res) => {
  const { id } = req.params;
  // console.log(req.userId);

  // user could only like the post once, by checking userId is authenticated or not
  if (!req.userId) return res.json({ message: "Unauthenticated" });

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with that id: ${id} `);

  // in this case we first find the post we are looking for
  const post = await PostMessage.findById(id);

  // now we will check is the userId already in the like section
  const index = post.likes.findIndex((id) => id === String(req.userId));

  // now we check if the user already liked the post he just able to dislike the post now
  if (index === -1) {
    // like the post, '-1' means if he didn't like the post
    post.likes.push(req.userId);
  } else {
    // if he dislike the post
    post.likes = post.likes.filter((id) => id !== String(req.userId));
  }

  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
    new: true,
  });

  res.json(updatedPost);
};

export const commentPost = async (req, res) => {
  // first destructuring data comming from the frontend i.e:
  const { id } = req.params;
  const { value } = req.body;

  // now we fetch the post to put the comment on.
  const post = await PostMessage.findById(id);

  post.comments.push(value); // pushing context/value of the comment to the fetched post

  // also updating post in db so it contains new comment
  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
    new: true,
  });

  // sending updatedPost to the frontend now.
  res.json(updatedPost);
};
