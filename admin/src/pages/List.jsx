import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BACKEND_URL, CURRENCY } from '../App';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

const List = () => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${BACKEND_URL}/api/products/list`);

      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async id => {
    try {
      const response = await axios.delete(`${BACKEND_URL}/api/products/remove/${id}`, { withCredentials: true });

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <p className="mb-2">All Products List</p>
      <div className="flex flex-col gap-2">
        {/* ---------- Listt Table Title ------------ */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-center">Action</b>
        </div>

        {/* ---------- Product List ----------- */}

        {list.map((item, index) => (
          <div className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm" key={index}>
            <img className="w-12" src={item.image[0]} alt="" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>
              {CURRENCY} {item.price}
            </p>
            <p onClick={() => removeProduct(item._id)} className="text-right md:text-center cursor-pointer text-2xl">
              <FontAwesomeIcon icon={faCircleXmark} style={{color: '#cb2a2a'}} />
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default List;
