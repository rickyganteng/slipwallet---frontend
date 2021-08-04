import axios from "axios";

export async function getStaticPaths() {
  const users = await axios
    .get("https://jsonplaceholder.typicode.com/users")
    .then((res) => {
      // console.log(res.data);
      return res.data;
    })
    .catch((err) => {
      // console.log(err);
      return [];
    });
  const paths = users.map((item) => ({
    params: { id: `${item.id}` },
  }));

  // console.log(paths);

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps(context) {
  // console.log(context.params);
  const user = await axios
    .get(`https://jsonplaceholder.typicode.com/users/${context.params.id}`)
    .then((res) => {
      // console.log(res.data);
      return res.data;
    })
    .catch((err) => {
      return {};
    });

  return {
    props: { user },
  };
}

export default function SSGPage(props) {
  // console.log(props);

  return (
    <>
      <h2>SSG Detail Page</h2>
      <h3>{props.user.name}</h3>
      <h3>{props.user.email}</h3>
    </>
  );
}
