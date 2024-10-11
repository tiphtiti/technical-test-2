import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useHistory } from "react-router-dom";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [availableUsers, setAvailableUsers] = useState();
  const [activities, setActivities] = useState([]);

  const history = useHistory();

  async function getUser() {
    const { data } = await api.get("/user/available");
    setAvailableUsers(data);
  }
  useEffect(() => {
    getUser();
    getWorkDone();
  }, []);

  async function getWorkDone(){
    setLoading(true);
    let date = new Date();
    let yesterday = new Date(date);
    yesterday.setDate(date.getDate() - 1);

    const { data } = await api.get(`/activity?datefrom=${yesterday.getTime()}&date_to=${date.getTime()}&user=&project=`);
    console.log(data);
    const usersTemp = await api.get(`/user`);
    const projects = await api.get(`/project/list`);
    setActivities(
      data.map((activity) => {
        return { ...activity, user: (activity.userId = usersTemp.data.find((user) => user._id === activity.userId)?.name), 
          project: (activity.projectId = projects.data.find((project) => project._id === activity.projectId)?.name) };
      }),
    );
    setLoading(false);
  }

  return (
    <div className="px-2 md:!px-8 flex flex-col md:flex-row gap-5 mt-5">
      <div className="flex flex-col gap-6 w-full">
        <div className="flex-1 mb-[10px]">
          <h2 className="text-[22px] font-semibold mb-4">Available</h2>
          {availableUsers?.map((user) => (
            <div key={user._id} className="bg-white mb-[10px] rounded-lg shadow-sm flex gap-4 p-3">
              <img src={user.avatar} alt="userlogo" className="rounded-full w-14 h-14" />
              <div>
                <h3 className="font-semibold text-lg mb-[3px]">{user.name}</h3>
                {/* <h3 className="text-[#676D7C] text-sm">{user.email}</h3> */}
                <h3 className="text-[#676D7C] text-sm">{user.job_title}</h3>
                <p className="text-[#676D7C] text-sm capitalize">{user.availability}</p>
              </div>
            </div>
          ))}
          {availableUsers?.length === 0 ? <span className="italic text-gray-600">No available users.</span> : null}
        </div>
        <div>
          <h2 className="text-[22px] font-semibold mb-4">Work done today</h2>
          <div className="flex flex-col gap-4">
            <div className="flex gap-2 px-4 font-semibold text-[#676D7C]">
              <h3 className="w-32">Project</h3>
              <h3 className="w-28">Hours</h3>
              <h3 className="w-36">User</h3>
              <h3 className="w-20">Cost</h3>
            </div>
            {!loading && activities.map((a, index) => (
              <div key={index} className="flex gap-2 rounded-lg bg-white hover:text-[#0069d9] shadow-sm items-center py-2 px-4 cursor-pointer" onClick={() => history.push(`/project/${a.projectId}`)}>
                <h3 className="w-32 font-semibold	">{a.project}</h3>
                <p className="w-28">{a.total}</p>
                <p className="w-36">{a.user}</p>
                <p className="w-20">{a.cost}€</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


export default Home;
