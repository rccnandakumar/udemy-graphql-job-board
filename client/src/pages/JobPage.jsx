import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { formatDate } from "../lib/formatters";
import { useJob } from "../lib/graphql/hooks";

function JobPage() {
  const { jobId } = useParams();
  const { job, loading, error } = useJob(jobId);
  // const [state, setState] = useState({
  //   job: null,
  //   loading: true,
  //   error: false,
  // });
  // useEffect(() => {
  //     (async () => {
  //       try {
  //         const job = await getJob(jobId);
  //         setState({job, loading: false, error: false});
  //       } catch (error) {
  //         console.log('error:', JSON.stringify(error, null, 2));
  //         setState({ job: null, loading: false, error: true });
  //       }
  //     })();
  //   }, [jobId]);
  //   const {job, loading, error} = state;
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="has-text-danger">Data Unavailable</div>;
  }

  return (
    <div>
      <h1 className="title is-2">{job.title}</h1>
      <h2 className="subtitle is-4">
        <Link to={`/companies/${job.company.id}`}>{job.company.name}</Link>
      </h2>
      <div className="box">
        <div className="block has-text-grey">
          Posted: {formatDate(job.date, "long")}
        </div>
        <p className="block">{job.description}</p>
      </div>
    </div>
  );
}

export default JobPage;
