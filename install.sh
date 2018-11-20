#!/bin/bash
ROS_DISTRO="kinetic"

# Install packages
apt-get install -q -y \
    dirmngr \
    gnupg2 \
    lsb-release

sh -c 'echo "deb http://packages.ros.org/ros/ubuntu $(lsb_release -sc) main" > /etc/apt/sources.list.d/ros-latest.list'
apt-key adv --keyserver hkp://ha.pool.sks-keyservers.net:80 --recv-key 421C365BD9FF1F717815A3895523BAEEB01FA116
apt-get update

# install bootstrap tools
apt-get install -y \
  python-rosdep \
  python-rosinstall \
  python-vcstools

# bootstrap rosdep
rosdep init && rosdep update

# Install ros packages
apt-get install -y \
  ros-$ROS_DISTRO-ros-core=1.3.2-0* \
  ros-$ROS_DISTRO-ros-base=1.3.2-0* \
  cmake \
  ros-$ROS_DISTRO-catkin \
  python-catkin-tools

# Install nodeJS.
curl -sL https://deb.nodesource.com/setup_10.x | bash -
apt-get update

apt-get install -y \
  curl \
  nodejs

npm install nodemon -g

# Install the social interaction as ROS package.
source /opt/ros/$ROS_DISTRO/setup.bash \
 && src \
 && catkin_make